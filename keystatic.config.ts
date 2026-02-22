import { config, fields, collection, singleton } from '@keystatic/core';

const DAYS_OF_WEEK = [
  { label: 'Monday', value: '1-mon' },
  { label: 'Tuesday', value: '2-tue' },
  { label: 'Wednesday', value: '3-wed' },
  { label: 'Thursday', value: '4-thu' },
  { label: 'Friday', value: '5-fri' },
  { label: 'Saturday', value: '6-sat' },
  { label: 'Sunday', value: '7-sun' },
];

export default config({
  storage: process.env.NODE_ENV === 'development' 
    ? { kind: 'local' } 
    : { 
        kind: 'github', 
        repo: 'quandosera/contrast-site' 
      },

  collections: {
    // 1. THE TALENT: DJs & Residents
    djs: collection({
      label: 'DJs & Hosts',
      slugField: 'slug', 
      path: 'src/content/djs/*',
      format: { contentField: 'bio' },
      schema: {
        slug: fields.text({ 
            label: 'Filename / URL Slug (e.g., dj-famous)', 
            validation: { isRequired: true } 
        }),
        name: fields.text({ 
            label: 'Stage Name (e.g., DJ Famous)', 
            validation: { isRequired: true } 
        }),
        // TOGGLE: Hide/Show DJ from the public page
        active: fields.checkbox({ 
            label: 'Public Profile Active', 
            defaultValue: true 
        }),
        // SORTING: Rank for manual ordering
        rank: fields.integer({ 
            label: 'Sort Rank (1 = Top of list, 99 = Bottom)', 
            defaultValue: 99 
        }),
        avatar: fields.image({
          label: 'Profile Photo',
          directory: 'public/uploads/djs',
          publicPath: '/uploads/djs',
          validation: { isRequired: true },
        }),
        genre: fields.text({ label: 'Primary Genres' }),
        socials: fields.object({
          instagram: fields.text({ label: 'Instagram Handle' }),
          soundcloud: fields.text({ label: 'SoundCloud URL' }),
        }),
        bio: fields.markdoc({ label: 'Biography' }),
      },
    }),

    // 2. THE PROGRAMS: The Show Series
    shows: collection({
      label: 'Shows',
      slugField: 'slug', 
      path: 'src/content/shows/*',
      format: 'yaml',
      schema: {
        slug: fields.text({ 
            label: 'URL Slug (e.g. test-show)', 
            validation: { isRequired: true } 
        }),
        title: fields.text({ 
            label: 'Show Title', 
            validation: { isRequired: true } 
        }),
        active: fields.checkbox({ label: 'Currently On Air', defaultValue: true }),
        hosts: fields.array(
          fields.relationship({ label: 'Host', collection: 'djs' }),
          { itemLabel: (props) => props.value || 'Select a DJ' }
        ),
        genre: fields.text({ label: 'Genre/Style' }),
        description: fields.text({ label: 'Show Pitch/Description', multiline: true }),
      },
    }),

    // 3. THE ARCHIVE: Recorded Episodes
    episodes: collection({
      label: 'Show Archive',
      slugField: 'title',
      path: 'src/content/episodes/*',
      format: { contentField: 'tracklist' },
      schema: {
        title: fields.text({ label: 'Episode Title' }),
        parentShow: fields.relationship({ label: 'Show Series', collection: 'shows' }),
        airDate: fields.date({ label: 'Original Air Date' }),
        audioUrl: fields.text({ label: 'Audio Link (SoundCloud/Mixcloud)' }),
        tracklist: fields.markdoc({ label: 'Tracklist / Show Notes' }),
      },
    }),

    // 4. THE VISUALS: Promotions
    flyers: collection({
      label: 'Flyers',
      slugField: 'title',
      path: 'src/content/flyers/*',
      format: 'yaml',
      schema: {
        title: fields.text({ label: 'Event Title', defaultValue: 'Untitled Flyer', validation: { isRequired: true } }),
        image: fields.image({
          label: 'Flyer Image',
          directory: 'public/uploads/flyers',
          publicPath: '/uploads/flyers',
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({ label: 'Feature on Homepage', defaultValue: false }),
      },
    }),
  },

  singletons: {
    // 5. THE TIMETABLE
    schedule: singleton({
      label: 'Master Timetable',
      path: 'src/content/schedule/master',
      format: 'yaml',
      schema: {
        allSlots: fields.array(
          fields.object({
            day: fields.select({ label: 'Day', options: DAYS_OF_WEEK, defaultValue: '1-mon' }),
            startTime: fields.text({ 
                label: 'Start Time (HH:MM)', 
                defaultValue: '12:00',
                validation: { 
                    length: { min: 5, max: 5 },
                    pattern: {
                        regex: /^([01]\d|2[0-3]):([0-5]\d)$/,
                        message: 'Time must be in 24-hour HH:MM format (e.g. 14:30)'
                    }
                }
            }),
            endTime: fields.text({ 
                label: 'End Time (HH:MM)', 
                defaultValue: '14:00',
                validation: { 
                    length: { min: 5, max: 5 },
                    pattern: {
                        regex: /^([01]\d|2[0-3]|24):([0-5]\d)$/,
                        message: 'Time must be in 24-hour HH:MM format. Use 24:00 for midnight.'
                    }
                }
            }),
            show: fields.relationship({ 
                label: 'Show', 
                collection: 'shows',
                validation: { isRequired: true } 
            }),
          }),
          {
            label: 'Global Time Slots',
            itemLabel: (props) => {
                const day = props.fields.day.value?.split('-')[1]?.toUpperCase() || '???';
                const time = props.fields.startTime.value || '00:00';
                const show = props.fields.show.value || 'TBA';
                return `${day} @ ${time} — ${show}`;
            }
          }
        )
      },
    }),
  },
});