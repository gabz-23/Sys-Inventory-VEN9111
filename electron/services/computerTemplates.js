export const DESKTOP_TEMPLATES = [
    { itemType: 'Componente', itemCategory: 'Procesador' },
    { itemType: 'Componente', itemCategory: 'Memoria RAM' },
    { itemType: 'Componente', itemCategory: 'Disco / Almacenamiento' },
    { itemType: 'Componente', itemCategory: 'Tarjeta Gráfica' },
    { itemType: 'Periférico', itemCategory: 'Teclado' },
    { itemType: 'Periférico', itemCategory: 'Mouse' },
    { itemType: 'Periférico', itemCategory: 'Monitor' },
];

export const LAPTOP_TEMPLATES = [
    { itemType: 'Componente', itemCategory: 'Memoria RAM' },
    { itemType: 'Componente', itemCategory: 'Disco / Almacenamiento' },
    { itemType: 'Componente', itemCategory: 'Tarjeta Gráfica' },
    { itemType: 'Periférico', itemCategory: 'Teclado' },
    { itemType: 'Periférico', itemCategory: 'Mouse' },
];

export const getTemplatesByComputerType = (computerType) => {
    if (computerType === 'Escritorio') return DESKTOP_TEMPLATES;
    if (computerType === 'Laptop') return LAPTOP_TEMPLATES;
    return [];
};
