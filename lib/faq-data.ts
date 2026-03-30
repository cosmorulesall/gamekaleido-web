import { type AccordionItem } from '@/components/marketing/Accordion';

export interface FaqCategory {
  name: string;
  items: AccordionItem[];
}

export const FAQ_DATA: FaqCategory[] = [
  {
    name: 'Product',
    items: [
      { id: 'product-1', question: 'What exactly is Gamekaleido?', answer: 'Gamekaleido creates personalised board games built around your life. You answer questions about your people, places, and memories, and we craft a unique game that only your group could play.' },
      { id: 'product-2', question: 'What types of games can I create?', answer: 'Currently we offer Property Trading (similar to Monopoly but with your own places) and Trivia (with questions about your group). More game types are coming soon.' },
      { id: 'product-3', question: 'How personalised is it really?', answer: 'Very. Your board spaces are your real places. Your cards reference real memories and inside jokes. Your trivia questions are about your group. Every element is unique to you.' },
    ],
  },
  {
    name: 'Ordering',
    items: [
      { id: 'ordering-1', question: 'How long does the creation process take?', answer: 'The questionnaire takes 5-15 minutes depending on how much detail you add. Your game is then generated within minutes.' },
      { id: 'ordering-2', question: 'Can I edit my game after creating it?', answer: 'Yes. You can review and edit every element of your game before purchasing — board spaces, cards, questions, and more.' },
    ],
  },
  {
    name: 'Pricing',
    items: [
      { id: 'pricing-1', question: 'What is the difference between Digital and Physical editions?', answer: 'The Digital edition gives you a shareable web-based companion to play on any device. The Physical edition includes a premium printed board, custom card deck, tokens, dice, and gift-ready packaging — plus the digital companion.' },
      { id: 'pricing-2', question: 'Is the digital edition a subscription?', answer: 'No. It is a one-time purchase. Your game is yours forever with no recurring fees.' },
    ],
  },
  {
    name: 'Shipping',
    items: [
      { id: 'shipping-1', question: 'Where do you ship?', answer: 'We currently ship to the UK. International shipping is coming soon.' },
      { id: 'shipping-2', question: 'How long does delivery take?', answer: 'Physical editions are printed on demand and typically delivered within 2-3 weeks.' },
    ],
  },
  {
    name: 'Technical',
    items: [
      { id: 'tech-1', question: 'What devices does the digital companion work on?', answer: 'Any device with a modern web browser — phone, tablet, laptop, or desktop. No app download required.' },
      { id: 'tech-2', question: 'Do I need an internet connection to play?', answer: 'The digital companion requires an internet connection. The physical board game can be played offline.' },
    ],
  },
];
