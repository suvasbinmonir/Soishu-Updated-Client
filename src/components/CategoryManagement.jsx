import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useReorderCategoriesMutation,
} from '../api/categoryApi';
import { useUserRole } from '../hooks/useRole';
import { showDeleteConfirmation } from './ShowDeleteConfirmation';
import { X } from 'lucide-react';

export const CategoryManagement = () => {
  const {
    data: categories = [],
    refetch,
    isLoading,
  } = useGetAllCategoriesQuery();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [reorderCategories] = useReorderCategoriesMutation();
  const { role } = useUserRole();

  const handleDelete = async (id) => {
    showDeleteConfirmation(() => {
      toast
        .promise(deleteCategory(id).unwrap(), {
          pending: 'Deleting category...',
          success: `Category "${id}" deleted!`,
          error: 'Failed to delete category.',
        })
        .finally(refetch);
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(categories);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const orders = reordered.map((item, index) => ({
      id: item._id,
      order: index,
    }));
    await reorderCategories({ orders });
  };

  return (
    <div className="bg-[#f7f7f7] p-4 md:p-6 rounded-lg max-w-7xl mx-auto space-y-8 mb-10">
      <h2 className="text-2xl font-semibold text-[#495057]">
        Category Order Management
      </h2>

      {/* Drag-and-Drop List */}
      {isLoading ? (
        <p>Loading categories...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="categories-list"
            isDropDisabled={false}
            isCombineEnabled={false}
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex items-center gap-5 flex-wrap"
              >
                {categories.map((category, index) => (
                  <Draggable
                    draggableId={category._id}
                    index={index}
                    key={category._id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group"
                      >
                        <div
                          className={`md:px-4 py-1 md:py-2 border border-[#B2672A] text-[#B2672A] rounded-lg outline-none`}
                        >
                          <h1 className="md:text-2xl text-lg md:font-bold capitalize">
                            {category.name}
                          </h1>
                        </div>
                        {role === 'Admin' && (
                          <div
                            onClick={() => handleDelete(category._id)}
                            className="absolute -top-2 right-0 cursor-pointer bg-[#f06548] text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={isDeleting}
                          >
                            <X size={14} />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
