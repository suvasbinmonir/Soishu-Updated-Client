import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannersQuery,
  useReorderBannersMutation,
} from '../../../../api/bannerApi';
import { useFileUploadMutation } from '../../../../api/fileUploadApi';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { showDeleteConfirmation } from '../../../../components/ShowDeleteConfirmation';

export const BannerManagement = () => {
  const { data: banners = [], refetch, isLoading } = useGetAllBannersQuery();
  const [createBanner] = useCreateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();
  const [reorderBanners] = useReorderBannersMutation();
  const [fileUpload] = useFileUploadMutation();

  const [newBanner, setNewBanner] = useState({
    alt: '',
    link: '',
    image: '',
  });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) return;

      const formData = new FormData();
      for (const file of acceptedFiles) {
        formData.append('files', file);
      }

      try {
        const response = await fileUpload(formData).unwrap();
        const uploadedUrl = response?.urls?.[0];
        if (uploadedUrl) {
          setNewBanner((prev) => ({ ...prev, image: uploadedUrl }));
        }
      } catch {
        toast.error('Image upload failed. Please try again.');
      }
    },
    [fileUpload]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openDropzone,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleCreateBanner = async () => {
    if (!newBanner.image || !newBanner.link)
      toast.warn('Banner and link is required');

    await createBanner({ ...newBanner, order: banners.length });
    toast.success('Banner add successfully');
    setNewBanner({ alt: '', link: '', image: '' });
  };

  const handleDelete = async (id) => {
    showDeleteConfirmation(() => {
      toast
        .promise(deleteBanner(id).unwrap(), {
          pending: 'Deleting banner...',
          success: `Banner "${id}" deleted!`,
          error: 'Failed to delete banner.',
        })
        .finally(refetch);
    });
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(banners);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const orders = reordered.map((item, index) => ({
      id: item._id,
      order: index,
    }));
    await reorderBanners({ orders });
  };

  return (
    <div className="bg-[#f7f7f7] p-4 md:p-6 rounded-lg max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold text-[#495057]">
        Banner Management
      </h2>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-6 text-center rounded-md cursor-pointer ${
          isDragActive ? 'bg-blue-50 border-[#0ab39c]' : 'border-gray-300'
        }`}
        onClick={openDropzone}
      >
        <input {...getInputProps()} />
        {newBanner.image ? (
          <img
            src={newBanner.image}
            alt="Preview"
            className="h-40 mx-auto rounded"
          />
        ) : (
          <p className="text-gray-500 h-40 flex justify-center items-center">
            Drag and drop an image, or click here to select one.
          </p>
        )}
      </div>

      <input
        type="text"
        placeholder="Alt Text"
        value={newBanner.alt}
        onChange={(e) => setNewBanner({ ...newBanner, alt: e.target.value })}
        className="input w-full border px-3 py-2 rounded border-gray-300 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Link"
        value={newBanner.link}
        onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
        className="input w-full border px-3 py-2 rounded border-gray-300 focus:outline-none"
      />
      <div className="w-full flex justify-end">
        <button
          onClick={handleCreateBanner}
          className="bg-[#099885] text-white cursor-pointer rounded-md text-sm font-semibold hover:bg-[#00846e] px-5 py-2.5"
        >
          Create Banner
        </button>
      </div>

      {/* Drag-and-Drop List */}
      {isLoading ? (
        <p>Loading banners...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="banner-list"
            isDropDisabled={false}
            isCombineEnabled={false}
          >
            {(provided) => (
              <div>
                <h2 className="text-2xl text-[#495057] font-semibold mb-6">
                  Banner List
                </h2>
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {banners.map((banner, index) => (
                    <Draggable
                      draggableId={banner._id}
                      index={index}
                      key={banner._id}
                    >
                      {(provided) => (
                        <div
                          className="flex items-center space-x-4 p-4 border border-gray-300 rounded bg-white"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <img
                            src={banner.image}
                            alt={banner.alt}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-[#495057]">
                              {banner.alt}
                            </p>
                            <a
                              href={banner.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#099885] text-sm"
                            >
                              {banner.link}
                            </a>
                          </div>
                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="text-[#f06548] bg-[#fde8e4] cursor-pointer px-5 py-2 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
