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
  storage: { kind: 'local' },

  collections: {
    djs: collection({
      label: 'DJs & Hosts',
      slugField: 'name',
      path: 'src/content/djs/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.text({ label: 'Stage Name', validation: { isRequired: true } }),
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

    shows: collection({
      label: 'Shows',
      slugField: 'title',
      path: 'src/content/shows/*',
      format: 'yaml',
      schema: {
        title: fields.text({ label: 'Show Title', validation: { isRequired: true } }),
        active: fields.checkbox({ label: 'Currently On Air', defaultValue: true }),
        hosts: fields.array(
          fields.relationship({ label: 'Host', collection: 'djs' }),
          { itemLabel: (props) => props.value || 'Select a DJ' }
        ),
        genre: fields.text({ label: 'Genre/Style' }),
        description: fields.text({ label: 'Show Pitch/Description', multiline: true }),
      },
    }),

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

    flyers: collection({
      label: 'Flyers',
      slugField: 'title',
      path: 'src/content/flyers/*',
      format: 'yaml',
      schema: {
        title: fields.text({ label: 'Event Title', validation: { isRequired: true } }),
        image: fields.image({
          label: 'Flyer Image',
          directory: 'public/uploads/flyers',
          publicPath: '/uploads/flyers',
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({ label: 'Feature on Homepage' }),
      },
    }),
  },

  singletons: {
    schedule: singleton({
      label: 'Master Timetable',
      path: 'src/content/schedule/master', // This will save to master.yaml
      format: 'yaml',
      schema: {
        allSlots: fields.array(
          fields.object({
            day: fields.select({ label: 'Day', options: DAYS_OF_WEEK, defaultValue: '1-mon' }),
            startTime: fields.text({ label: 'Start Time (HH:MM)', defaultValue: '12:00' }),
            endTime: fields.text({ label: 'End Time (HH:MM)', defaultValue: '14:00' }),
            show: fields.relationship({ 
                label: 'Show', 
                collection: 'shows',
                // Optional: set validation isRequired: true if you don't want empty slots
            }),
          }),
          {
            label: 'Global Time Slots',
            // Improved itemLabel to handle empty shows gracefully
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