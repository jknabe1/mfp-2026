import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // MAIN CONTENT FOLDER
      S.listItem()
        .title('Huvudinnehåll')
        .icon(() => '📋')
        .child(
          S.list()
            .title('Huvudinnehåll')
            .items([
              S.documentTypeListItem('event').title('Events'),
              S.documentTypeListItem('arrangemang').title('Arrangemang'),
              S.documentTypeListItem('forening').title('Föreningar'),
              S.documentTypeListItem('venue').title('Venues'),
            ])
        ),
      
      // MEDIA FOLDER
      S.listItem()
        .title('Media')
        .icon(() => '🎬')
        .child(
          S.list()
            .title('Media')
            .items([
            ])
        ),
      
      // INFORMATION FOLDER
      S.listItem()
        .title('Information')
        .icon(() => 'ℹ️')
        .child(
          S.list()
            .title('Information')
            .items([
              S.documentTypeListItem('about').title('Om oss'),
              S.documentTypeListItem('news').title('Nyheter (edits)'),
              S.documentTypeListItem('team').title('Team'),
              S.documentTypeListItem('sponsor').title('Sponsors'),
            ])
        ),
      
      // UTILITY FOLDER
      S.listItem()
        .title('Rättsligt')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Utility')
            .items([
              S.documentTypeListItem('data').title('Data'),
            ])
        ),
      
      // DIVIDER
      S.divider(),
      
      // SINGLETONS (if you have any)
      // ... other items
    ])