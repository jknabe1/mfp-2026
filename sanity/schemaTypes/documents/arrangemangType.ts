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
      name: 'Bildgalleri',
      type: 'array',
      title: 'Bildgalleri',
      description: 'Galleribilder för arrangemanget',
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
      description: 'Beskrivning av denna samling/arrangemang'
    }),
    defineField({
      name: 'events',
      type: 'array',
      title: 'Events/Konserter',
      description: 'Referens till events som ingår i denna arrangemang-samling',
      of: [{
        type: 'reference',
        to: [{type: 'event'}]
      }],
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
