'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {defineConfig} from 'sanity'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',
  projectId: 'g3r6iupk',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2026-02-28',
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schemaTypes,
})
