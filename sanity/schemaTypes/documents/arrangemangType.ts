import {defineField, defineType} from 'sanity'

export const arrangemangType = defineType({
  name: 'arrangemang',
  title: 'Arrangemang',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Namn',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Huvudbild',
      description: 'Huvudbilden som visas i hero-sektionen',
      options: {
        hotspot: true
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Sammanfattning',
      description: 'Kort sammanfattning av arrangemanget',
      rows: 3,
    }),
    defineField({
      name: 'details',
      type: 'array',
      title: 'Detaljer',
      description: 'Huvudinnehål för sidan',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'gallery',
      type: 'array',
      title: 'Bildgalleri',
      description: 'Galleribilder för arrangemanget',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'asset',
            type: 'image',
            title: 'Bild',
            options: {
              hotspot: true
            }
          },
          {
            name: 'alt',
            type: 'string',
            title: 'Alt-text',
            description: 'Beskrivande text för tillgänglighet',
          },
          {
            name: 'caption',
            type: 'string',
            title: 'Bildtext',
            description: 'Valfri bildtext under bilden',
          }
        ],
        preview: {
          select: {
            media: 'asset',
            title: 'alt',
            subtitle: 'caption'
          }
        }
      }],
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL-slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
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
  ],
})
