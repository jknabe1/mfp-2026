import {defineField, defineType} from 'sanity'

export const foreningType = defineType({
  name: 'forening',
  title: 'Föreningar',
  type: 'document',
  fields: [
    defineField(
      {
      name: 'Namn',
      type: 'string',
    }),
    defineField({
      name: 'Bild',
      type: 'image',
      options: {
        hotspot: true
      },
    }),
    defineField({
      name: 'Beskrivning',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'URL',
      type: 'slug',
      options: {source: 'Namn'},
      validation: (rule) => rule
      .required()
      .error(`Required to generate a page on the website`),
    }),
  ],
})
