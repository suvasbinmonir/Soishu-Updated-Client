import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import {
  useDeleteProductByIdMutation,
  useGetAllProductsQuery,
  useUpdateProductByIdMutation,
} from '../api/productsApi';

const ProductTable = () => {
  const [editCell, setEditCell] = useState({ rowId: null, field: null });
  const [copiedCell, setCopiedCell] = useState({ rowId: null, field: null });
  const [editValue, setEditValue] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    color: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sort: 'desc',
    page: 1,
    limit: 25,
  });
  const { data, isLoading, refetch } = useGetAllProductsQuery();
  const products = data?.data || [];
  const [deleteProduct] = useDeleteProductByIdMutation();
  const [updateProduct] = useUpdateProductByIdMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleDelete = (id) => {
    deleteProduct(id).refetch;
  };

  const handleCellClick = (rowId, field, value) => {
    navigator.clipboard.writeText(value);
    setCopiedCell({ rowId, field });
    setTimeout(() => setCopiedCell({ rowId: null, field: null }), 1500);
  };

  const handleDoubleClick = (rowId, field, value) => {
    setEditCell({ rowId, field });
    setEditValue(value);
  };

  const handleInputBlur = (productId, field) => {
    const updatedData = { [field]: editValue };

    updateProduct({ productId, data: updatedData }).then(() => {
      refetch();
      setEditCell({ rowId: null, field: null });
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Consignment Table */}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs uppercase bg-gray-50 text-gray-700">
              <tr className="border-b border-gray-500">
                <th className="px-6 py-4">Name</th>
                {/* <th className="px-6 py-4">Description</th> */}
                <th className="px-6 py-4">Material</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Color</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  {[
                    { field: 'name', value: product.name },
                    // { field: 'description', value: product.description },
                    { field: 'made_with', value: product.made_with },
                    { field: 'price', value: product.price },
                    { field: 'color', value: product.color },
                    { field: 'size', value: product.size },
                    { field: 'note', value: product.note },
                    { field: 'stock', value: product.stock },
                  ].map(({ field, value }) => (
                    <td
                      key={field}
                      className={`px-6 py-4 cursor-pointer ${
                        copiedCell.rowId === product._id &&
                        copiedCell.field === field
                          ? 'bg-gray-100'
                          : ''
                      }`}
                      onClick={() => handleCellClick(product._id, field, value)}
                      onDoubleClick={() =>
                        handleDoubleClick(product._id, field, value)
                      }
                    >
                      {editCell.rowId === product._id &&
                      editCell.field === field ? (
                        <input
                          type="text"
                          className="border py-2"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => handleInputBlur(product._id, field)}
                          autoFocus
                        />
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 pl-10">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(prev.page - 1, 1),
                }))
              }
              disabled={filters.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>
              Page {filters.page} of {data?.pages || 1}
            </span>

            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              disabled={filters.page >= (data?.pages || 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
