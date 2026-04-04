export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'board' | 'cards' | 'companion';
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'demo-board-1', title: 'The Wanderlust Edition', description: 'A property trading game built around London neighbourhoods and favourite holiday spots.', type: 'board' },
  { id: 'demo-board-2', title: 'Family Game Night', description: 'A trivia game featuring family memories, embarrassing stories, and decades of in-jokes.', type: 'cards' },
  { id: 'demo-board-3', title: 'The Flatmate Files', description: 'A property trading game based on a shared house — every space is a real room or local haunt.', type: 'companion' },
  { id: 'demo-board-4', title: 'Anniversary Special', description: "A couples' game retracing a relationship through places, dates, and private memories.", type: 'board' },
  { id: 'demo-board-5', title: 'The Office Edition', description: 'A team-building trivia game about office culture, memorable projects, and workplace legends.', type: 'cards' },
  { id: 'demo-board-6', title: 'Graduation Gift', description: 'A university memories game featuring halls, lecture theatres, favourite pubs, and campus lore.', type: 'board' },
];
