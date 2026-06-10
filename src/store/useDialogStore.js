import { create } from 'zustand';

export const useDialogStore = create((set) => ({
    isAddDialogOpen: false,
    initialCategoryId: null,
    detailsItem: null,
    editData: null,
    deleteData: null,
    pendingAccessoryCreation: null, // Nuevo estado para manejar la navegación desde otras páginas

    openAddDialog: (categoryId = null) => {
        return set(() => ({
            isAddDialogOpen: true,
            initialCategoryId: categoryId,
        }));
    },

    setInitialCategoryId: (categoryId) => set({ initialCategoryId: categoryId }),
    setPendingAccessoryCreation: (categoryId) => set({ pendingAccessoryCreation: categoryId }),
    openDetailsDialog: (data) => set(() => ({ detailsItem: data })),
    openEditDialog: (data) => set(() => ({ editData: data })),
    openDeleteDialog: (data) => set(() => ({ deleteData: data })),

    closeDialog: () =>
        set({
            editData: null,
            detailsItem: null,
            deleteData: null,
            // No borrar initialCategoryId aquí para permitir que se abra el diálogo de agregar
        }),
    closeAddDialog: () =>
        set({
            isAddDialogOpen: false,
            initialCategoryId: null,
        }),
}));
