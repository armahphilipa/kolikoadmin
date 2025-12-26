import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Product } from '../types';
import { Plus, Edit2, Trash2, Search, Filter, Upload, X, Loader2 } from 'lucide-react';

interface ModalImage {
  id: string;
  url: string;
  file?: File;
  isNew: boolean;
}

// Image Compression Utility
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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [modalImages, setModalImages] = useState<ModalImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const data = await api.products.getAll();
    setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setModalImages([
        { id: 'main', url: product.imageUrl, isNew: false },
        ...product.images.map((img, idx) => ({ id: `gal-${idx}`, url: img, isNew: false }))
    ]);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentProduct({
        status: 'active',
        stock: 0,
        price: 0,
        category: 'Sneakers'
    });
    setModalImages([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
      if(window.confirm('Are you sure you want to delete this product?')) {
          await api.products.delete(id);
          setProducts(products.filter(p => p.id !== id));
      }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      const newImages: ModalImage[] = [];
      
      for (const file of files) {
          try {
              const compressed = await compressImage(file);
              const url = URL.createObjectURL(compressed);
              newImages.push({
                  id: Math.random().toString(36).substr(2, 9),
                  url,
                  file: compressed,
                  isNew: true
              });
          } catch (err) {
              console.error("Error processing image", err);
          }
      }
      setModalImages([...modalImages, ...newImages]);
    }
  };

  const removeModalImage = (id: string) => {
      setModalImages(modalImages.filter(img => img.id !== id));
  }

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
          // Simulate uploading new images
          const finalImages = await Promise.all(modalImages.map(async (img) => {
              if (img.isNew && img.file) {
                 return await api.storage.upload(img.file);
              }
              return img.url;
          }));

          const mainImage = finalImages[0] || 'https://via.placeholder.com/200';
          const galleryImages = finalImages; 

          const productData = {
              ...currentProduct,
              imageUrl: mainImage,
              images: galleryImages,
              name: currentProduct.name || 'Untitled',
              price: Number(currentProduct.price) || 0,
              stock: Number(currentProduct.stock) || 0,
              category: currentProduct.category || 'Uncategorized',
              description: currentProduct.description || ''
          } as Product;

          if (productData.id) {
              await api.products.update(productData);
              setProducts(products.map(p => p.id === productData.id ? productData : p));
          } else {
              const newProduct = await api.products.create(productData);
              setProducts([...products, newProduct]);
          }
          setIsModalOpen(false);
      } catch (error) {
          console.error(error);
          alert('Failed to save product');
      } finally {
          setIsSubmitting(false);
      }
  };
  
  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
        <button 
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex gap-4">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300">
             <Filter size={18} />
             <span>Filters</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700 text-sm">
              {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">No products found.</td></tr>
              ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-slate-700 overflow-hidden border border-gray-200 dark:border-slate-600">
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{product.category}</td>
                      <td className="p-4 font-medium text-gray-900 dark:text-white">GH₵{product.price.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`${product.stock < 10 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-600 dark:text-gray-300'}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {currentProduct.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                      value={currentProduct.name || ''}
                      onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                     <select 
                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                      value={currentProduct.category || ''}
                      onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                     >
                       <option>Sneakers</option>
                       <option>Casual</option>
                       <option>Sports</option>
                       <option>Sandals</option>
                     </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (GH₵)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                      value={currentProduct.price || ''}
                      onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      required
                      className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                      value={currentProduct.stock || ''}
                      onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                    />
                 </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    value={currentProduct.description || ''}
                    onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                  />
              </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Images</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                     {modalImages.map(img => (
                         <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-slate-600 group">
                             <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                             <button 
                               type="button"
                               onClick={() => removeModalImage(img.id)}
                               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                             >
                               <X size={12} />
                             </button>
                         </div>
                     ))}
                     <button 
                       type="button"
                       onClick={() => fileInputRef.current?.click()}
                       className="aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-400 dark:hover:text-indigo-400 dark:hover:border-indigo-500 transition-colors"
                     >
                        <Upload size={24} />
                        <span className="text-xs mt-1">Add Image</span>
                     </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    multiple 
                    accept="image/*"
                  />
               </div>
               
               <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="status"
                    checked={currentProduct.status === 'active'}
                    onChange={e => setCurrentProduct({...currentProduct, status: e.target.checked ? 'active' : 'inactive'})}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="status" className="text-sm text-gray-700 dark:text-gray-300">Product is active and visible</label>
               </div>

               <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center"
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin mr-2" />}
                    {currentProduct.id ? 'Save Changes' : 'Create Product'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;