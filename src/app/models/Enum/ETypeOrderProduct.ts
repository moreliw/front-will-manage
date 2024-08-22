export enum ETypeOrderProduct {
  Code = 1,
  Name = 2,
  Category = 3,
  LargerQtd = 4,
  SmallQtd = 5,
}

export const ETypeOrderProductLabel: Record<ETypeOrderProduct, string> = {
  [ETypeOrderProduct.Code]: 'Código',
  [ETypeOrderProduct.Name]: 'Nome',
  [ETypeOrderProduct.Category]: 'Categoria',
  [ETypeOrderProduct.LargerQtd]: 'Quantidade maior',
  [ETypeOrderProduct.SmallQtd]: 'Quantidade menor',
};
