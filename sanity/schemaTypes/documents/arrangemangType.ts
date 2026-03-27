import {defineField, defineType} from 'sanity'

export const arrangemangType = defineType({
  name: 'arrangemang',
  title: 'Arrangemang',
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
      title: 'Huvudbild',
      description: 'Huvudbilden som visas överst på sidan',
      options: {
        hotspot: true
      },
    }),
    defineField({
      name: 'Bilder',
      type: 'array',
      title: 'Galleribilder',
      description: 'Ytterligare bilder för bildgalleri nedan huvudbilden',
      of: [{
        type: 'image',
        options: {
          hotspot: true
        }
      }],
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
