import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { RepairRequest, RepairStatus } from '../types';
import { 
  Search, 
  RefreshCw, 
  Hammer, 
  Eye, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Plus,
  Upload,
  Download,
  Loader2,
  X,
  Calendar
} from 'lucide-react';

// Reuse image compression utility
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas is empty'));
            }
          }, 'image/jpeg', 0.7);
        } else {
            reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const RepairRequests: React.FC = () => {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RepairStatus>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Partial<RepairRequest>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit/Create specific state
  const [editCost, setEditCost] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<RepairStatus>('Pending');
  const [editCompletionDate, setEditCompletionDate] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const data = await api.repairs.getAll();
    setRequests(data);
    setLoading(false);
  };

  const handleRowClick = (req: RepairRequest) => {
    setIsCreating(false);
    setSelectedRequest(req);
    setEditCost(req.estimatedCost || 0);
    setEditStatus(req.status);
    setEditCompletionDate(req.estimatedCompletionDate || '');
    setImagePreview(req.imageUrl || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedRequest({
      status: 'Pending',
      date: new Date().toISOString(),
      estimatedCost: 0
    });
    setEditCost(0);
    setEditStatus('Pending');
    setEditCompletionDate('');
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Client-side validation
      if (!file.type.startsWith('image/')) {
        alert("Invalid file type. Please upload an image (PNG, JPG).");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size exceeds 5MB limit. Please upload a smaller image.");
        return;
      }

      try {
        const compressed = await compressImage(file);
        setImageFile(compressed);
        setImagePreview(URL.createObjectURL(compressed));
      } catch (err) {
        console.error("Error processing image", err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isCreating) {
        // Handle Creation
        let uploadedImageUrl = undefined;
        if (imageFile) {
          uploadedImageUrl = await api.storage.upload(imageFile);
        }

        const newRequest = await api.repairs.create({
          customerName: selectedRequest.customerName || 'Guest',
          email: selectedRequest.email || '',
          phone: selectedRequest.phone || '',
          productName: selectedRequest.productName || '',
          issueDescription: selectedRequest.issueDescription || '',
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          estimatedCost: 0, // Initial cost is usually 0 until assessed
          imageUrl: uploadedImageUrl
        } as Omit<RepairRequest, 'id'>);

        setRequests([newRequest, ...requests]);

      } else if (selectedRequest.id) {
        // Handle Update (Status/Cost/Date)
        const result = await api.repairs.update(selectedRequest.id, {
          status: editStatus,
          estimatedCost: editCost,
          estimatedCompletionDate: editCompletionDate || undefined
        });
        
        if (result) {
          setRequests(requests.map(r => r.id === result.id ? result : r));
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save request", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      req.customerName.toLowerCase().includes(term) || 
      req.id.toLowerCase().includes(term) ||
      req.productName.toLowerCase().includes(term);
      
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: RepairStatus) => requests.filter(r => r.status === status).length;

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'Pending':
        return <span className="flex items-center text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium"><Clock size={12} className="mr-1" /> Pending</span>;
      case 'In Progress':
        return <span className="flex items-center text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium"><Hammer size={12} className="mr-1" /> In Progress</span>;
      case 'Waiting for Parts':
        return <span className="flex items-center text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium"><AlertCircle size={12} className="mr-1" /> Waiting Parts</span>;
      case 'Completed':
        return <span className="flex items-center text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={12} className="mr-1" /> Completed</span>;
      case 'Rejected':
        return <span className="flex items-center text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium"><XCircle size={12} className="mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Repair Services</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage product repair requests and status updates</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={fetchRequests}
            className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search request ID, customer, or product..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Statuses ({requests.length})</option>
              <option value="Pending">Pending ({getStatusCount('Pending')})</option>
              <option value="In Progress">In Progress ({getStatusCount('In Progress')})</option>
              <option value="Waiting for Parts">Waiting for Parts ({getStatusCount('Waiting for Parts')})</option>
              <option value="Completed">Completed ({getStatusCount('Completed')})</option>
              <option value="Rejected">Rejected ({getStatusCount('Rejected')})</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Request ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product & Issue</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Est. Cost</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading requests...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {searchTerm || statusFilter !== 'all' 
                      ? "No repair requests match your filters." 
                      : "No repair requests found."}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{req.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{req.customerName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{req.phone}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs">
                         <div className="font-medium text-gray-800 dark:text-white">{req.productName}</div>
                         <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{req.issueDescription}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {req.estimatedCost > 0 ? `GH₵${req.estimatedCost.toFixed(2)}` : <span className="text-gray-400 italic">Not set</span>}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleRowClick(req)}
                        className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-full transition-colors" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {isCreating ? 'Submit New Repair Request' : `Repair Request: ${selectedRequest.id}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              {/* Conditional Layout based on Create vs Edit */}
              
              {isCreating ? (
                /* CREATE MODE FORM */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
                      <input 
                        type="text" required
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        value={selectedRequest.customerName || ''}
                        onChange={(e) => setSelectedRequest({...selectedRequest, customerName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <input 
                        type="tel" required
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        value={selectedRequest.phone || ''}
                        onChange={(e) => setSelectedRequest({...selectedRequest, phone: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input 
                        type="email" required
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        value={selectedRequest.email || ''}
                        onChange={(e) => setSelectedRequest({...selectedRequest, email: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                      <input 
                        type="text" required
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="e.g. Koliko Runner V1"
                        value={selectedRequest.productName || ''}
                        onChange={(e) => setSelectedRequest({...selectedRequest, productName: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Description</label>
                      <textarea 
                        rows={4} required
                        className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                        placeholder="Describe the damage or issue..."
                        value={selectedRequest.issueDescription || ''}
                        onChange={(e) => setSelectedRequest({...selectedRequest, issueDescription: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image of Issue</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div className="relative h-48 w-full mx-auto">
                            <img src={imagePreview} alt="Preview" className="h-full mx-auto object-contain rounded-lg" />
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Image selected</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <span className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                Upload a file
                              </span>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG up to 5MB</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW/EDIT MODE */
                <div className="space-y-6">
                   <div className="flex gap-6">
                      {imagePreview && (
                        <div className="w-1/3 relative group">
                          <div className="aspect-square rounded-lg bg-gray-100 dark:bg-slate-700 overflow-hidden border border-gray-200 dark:border-slate-600">
                            <img src={imagePreview} alt="Damage" className="w-full h-full object-cover" />
                          </div>
                          <a 
                            href={imagePreview} 
                            download={`repair-${selectedRequest.id}-image.jpg`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover:opacity-100"
                            title="Download Image"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      )}
                      <div className={imagePreview ? "w-2/3" : "w-full"}>
                         <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date Submitted</label>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.date ? new Date(selectedRequest.date).toLocaleDateString() : '-'}</p>
                            </div>
                            {selectedRequest.estimatedCompletionDate && (
                              <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Est. Completion</label>
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
                                  <Calendar size={14} className="mr-1" />
                                  {new Date(selectedRequest.estimatedCompletionDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            <div>
                              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</label>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.customerName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.email}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedRequest.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</label>
                              <p className="text-gray-900 dark:text-white font-medium">{selectedRequest.productName}</p>
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Issue Description</label>
                            <p className="text-gray-700 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                              {selectedRequest.issueDescription}
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
                      <h3 className="font-bold text-gray-800 dark:text-white mb-4">Admin Status Update</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status</label>
                            <select 
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value as RepairStatus)}
                              className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                            >
                               <option value="Pending">Pending</option>
                               <option value="In Progress">In Progress</option>
                               <option value="Waiting for Parts">Waiting for Parts</option>
                               <option value="Completed">Completed</option>
                               <option value="Rejected">Rejected</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Cost</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">GH₵</span>
                              <input 
                                type="number"
                                min="0"
                                step="0.01"
                                value={editCost}
                                onChange={(e) => setEditCost(parseFloat(e.target.value))}
                                className="w-full pl-12 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                              />
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Est. Completion Date</label>
                            <input 
                                type="date"
                                value={editCompletionDate}
                                onChange={(e) => setEditCompletionDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                            />
                        </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-sm"
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                  {isCreating ? 'Submit Request' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairRequests;