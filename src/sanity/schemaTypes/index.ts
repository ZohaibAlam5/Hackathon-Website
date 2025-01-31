import { type SchemaTypeDefinition } from 'sanity'
import { products } from '../schemas/products'
import { shop } from '../schemas/shop'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [products, shop],
}
