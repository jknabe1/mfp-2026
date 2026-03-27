import {defineField, defineType} from 'sanity'

export const arrangemangType = defineType({
  name: 'arrangemang',
  title: 'Arrangemang',
  type: 'document',
  fields: [
    defineField({
      name: 'Namn',
      type: 'string',
    }),
    defineField({
      name: 'Bild',
      type: 'image',
      title: 'Huvudbild',
      options: {
        hotspot: true
      },
    }),
    defineField({
      name: 'gallery',
      title: 'Bildgalleri',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Bildtext',
            }
          ]
        }
      ],
      options: {
        layout: 'grid'
      }
    }),
    defineField({
      name: 'Beskrivning',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'additionalInfo',
      title: 'Ytterligare information',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Plats',
      type: 'string',
    }),
    defineField({
      name: 'price',
      title: 'Pris',
      type: 'string',
    }),
    defineField({
      name: 'ticketLink',
      title: 'Biljettlänk',
      type: 'url',
    }),
    defineField({
      name: 'URL',
      type: 'slug',
      options: {source: 'Namn'},
      validation: (rule) => rule
        .required()
        .error(`Required to generate a page on the website`),
    }),
    defineField({
      name: 'Instagram',
      type: 'url',
      title: 'Instagram URL',
    }),
    defineField({
      name: 'Facebook',
      type: 'url',
      title: 'Facebook URL',
    }),
    defineField({
      name: 'spotify',
      type: 'url',
      title: 'Spotify URL',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Kort beskrivning',
      rows: 3,
    }),
  ],
})