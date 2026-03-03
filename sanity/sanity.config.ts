import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from "./schemaTypes"
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'Music For Pennies',
  
  basePath: '/studio',
  projectId: 'g3r6iupk',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2026-02-28',
  
  studioHost: 'musicforpennies', // Your custom hostname

  plugins: [
    structureTool({
      structure // Add this line
    })
  ],
  
  schema: {
    types: schemaTypes,
  },
})