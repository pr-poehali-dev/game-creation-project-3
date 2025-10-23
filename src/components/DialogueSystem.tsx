import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface DialogueChoice {
  text: string;
  nextId: string;
  affection?: number;
}

interface DialogueNode {
  id: string;
  character: 'shadow-milk' | 'black-sapphire' | 'narrator';
  text: string;
  choices?: DialogueChoice[];
  background?: string;
}

const dialogueData: DialogueNode[] = [
  {
    id: 'start',
    character: 'narrator',
    text: 'Королевство теней. Мрачный замок утопает в вечной тьме. Shadow Milk проводит всё больше времени со своим сыном...',
    choices: [
      { text: 'Продолжить', nextId: 'scene1' }
    ]
  },
  {
    id: 'scene1',
    character: 'shadow-milk',
    text: 'Black Sapphire... Мой дорогой мальчик. Как же ты вырос. *смеётся* Иди ко мне ближе.',
    choices: [
      { text: 'Подойти к отцу', nextId: 'approach', affection: 5 },
      { text: 'Остаться на месте', nextId: 'stay', affection: -3 }
    ]
  },
  {
    id: 'approach',
    character: 'black-sapphire',
    text: 'Отец... *подходит ближе* Вы хотели меня видеть?',
    choices: [
      { text: 'Продолжить', nextId: 'scene2_close' }
    ]
  },
  {
    id: 'stay',
    character: 'black-sapphire',
    text: 'Отец, я здесь. *остаётся на прежнем расстоянии* Что вам нужно?',
    choices: [
      { text: 'Продолжить', nextId: 'scene2_distant' }
    ]
  },
  {
    id: 'scene2_close',
    character: 'shadow-milk',
    text: '*нежно касается лица сына* Вот так... Я так давно хотел... просто побыть с тобой рядом. *его взгляд становится более интенсивным*',
    choices: [
      { text: 'Позволить прикосновение', nextId: 'allow_touch', affection: 10 },
      { text: 'Мягко отстраниться', nextId: 'gentle_refuse', affection: -5 }
    ]
  },
  {
    id: 'scene2_distant',
    character: 'shadow-milk',
    text: '*хмурится* Неужели мой собственный сын боится меня? *его голос становится холоднее* Я не потерплю такого отношения.',
    choices: [
      { text: 'Извиниться и подойти', nextId: 'apologize', affection: 3 },
      { text: 'Объяснить свои чувства', nextId: 'explain', affection: -2 }
    ]
  },
  {
    id: 'allow_touch',
    character: 'black-sapphire',
    text: '*краснеет* Отец... я всегда рядом с вами. Вы же знаете.',
    choices: [
      { text: 'Продолжить', nextId: 'scene3_affection_high' }
    ]
  },
  {
    id: 'gentle_refuse',
    character: 'black-sapphire',
    text: 'Отец, простите... мне просто... неловко. *смотрит в сторону*',
    choices: [
      { text: 'Продолжить', nextId: 'scene3_affection_low' }
    ]
  },
  {
    id: 'apologize',
    character: 'black-sapphire',
    text: 'Простите, отец. *быстро подходит* Я не хотел вас обидеть.',
    choices: [
      { text: 'Продолжить', nextId: 'scene3_affection_medium' }
    ]
  },
  {
    id: 'explain',
    character: 'black-sapphire',
    text: 'Я не боюсь вас, отец. Просто... последнее время вы ведёте себя странно.',
    choices: [
      { text: 'Продолжить', nextId: 'scene3_confrontation' }
    ]
  },
  {
    id: 'scene3_affection_high',
    character: 'shadow-milk',
    text: '*обнимает сына* Ты такой послушный... такой идеальный. Мои чувства к тебе... они становятся сильнее с каждым днём.',
    choices: [
      { text: 'Обнять в ответ', nextId: 'reciprocate', affection: 15 },
      { text: 'Напомнить о границах', nextId: 'boundaries', affection: -10 }
    ]
  },
  {
    id: 'scene3_affection_low',
    character: 'shadow-milk',
    text: '*ревниво* Неловко? С собственным отцом? *смеётся горько* Или ты нашёл кого-то важнее меня?',
    choices: [
      { text: 'Уверить в верности', nextId: 'reassure', affection: 8 },
      { text: 'Попросить времени', nextId: 'ask_time', affection: -8 }
    ]
  },
  {
    id: 'scene3_affection_medium',
    character: 'shadow-milk',
    text: 'Хорошо. *гладит по голове* Я простил тебя. Но помни — я не люблю, когда мне отказывают.',
    choices: [
      { text: 'Кивнуть', nextId: 'nod', affection: 5 },
      { text: 'Промолчать', nextId: 'silence', affection: 0 }
    ]
  },
  {
    id: 'scene3_confrontation',
    character: 'shadow-milk',
    text: '*его глаза вспыхивают* Странно? *смеётся истерично* Я ВЛАДЫКА ТЕНЕЙ! Я делаю что хочу! И если я хочу любить своего сына... я буду!',
    choices: [
      { text: 'Попытаться успокоить', nextId: 'calm', affection: -5 },
      { text: 'Уйти', nextId: 'leave', affection: -20 }
    ]
  },
  {
    id: 'reciprocate',
    character: 'narrator',
    text: 'Black Sapphire обнимает отца в ответ. Их отношения переходят на новый уровень близости...',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'boundaries',
    character: 'narrator',
    text: 'Black Sapphire устанавливает границы. Shadow Milk недоволен, но уважает решение сына... пока что.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'reassure',
    character: 'narrator',
    text: 'Black Sapphire уверяет отца в своей преданности. Shadow Milk доволен, его ревность утихает.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'ask_time',
    character: 'narrator',
    text: 'Black Sapphire просит времени. Shadow Milk в ярости уходит. Их отношения становятся напряжёнными.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'nod',
    character: 'narrator',
    text: 'Black Sapphire покорно кивает. Shadow Milk удовлетворён. Их отношения остаются стабильными.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'silence',
    character: 'narrator',
    text: 'Black Sapphire молчит. Shadow Milk хмурится, но не настаивает. Напряжение висит в воздухе.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'calm',
    character: 'narrator',
    text: 'Black Sapphire пытается успокоить отца. Shadow Milk постепенно приходит в себя, но остаётся обиженным.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'leave',
    character: 'narrator',
    text: 'Black Sapphire уходит. Shadow Milk остаётся один в ярости и боли. Их отношения находятся на грани разрыва.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  }
];

interface DialogueSystemProps {
  onClose: () => void;
}

const DialogueSystem = ({ onClose }: DialogueSystemProps) => {
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [affectionLevel, setAffectionLevel] = useState(50);

  const currentNode = dialogueData.find(node => node.id === currentNodeId);

  if (!currentNode) return null;

  const handleChoice = (choice: DialogueChoice) => {
    if (choice.affection) {
      setAffectionLevel(prev => Math.max(0, Math.min(100, prev + choice.affection)));
    }
    setCurrentNodeId(choice.nextId);
  };

  const getCharacterName = (character: string) => {
    switch (character) {
      case 'shadow-milk': return 'Shadow Milk';
      case 'black-sapphire': return 'Black Sapphire';
      default: return '';
    }
  };

  const getCharacterIcon = (character: string) => {
    switch (character) {
      case 'shadow-milk': return 'Drama';
      case 'black-sapphire': return 'Gem';
      default: return 'BookText';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon name="Heart" size={24} className="text-primary" />
            <div className="w-64 h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${affectionLevel}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{affectionLevel}%</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/30 p-8 animate-fade-in">
          {currentNode.character !== 'narrator' && (
            <div className="flex items-center gap-3 mb-4">
              <Icon name={getCharacterIcon(currentNode.character)} size={32} className="text-primary" />
              <h3 className="text-2xl font-display font-bold">{getCharacterName(currentNode.character)}</h3>
            </div>
          )}
          
          <p className="text-lg leading-relaxed mb-8 font-body min-h-[100px]">
            {currentNode.text}
          </p>

          <div className="space-y-3">
            {currentNode.choices?.map((choice, index) => (
              <Button
                key={index}
                className="w-full bg-primary/20 hover:bg-primary/40 border-2 border-primary/40 hover:border-primary text-foreground justify-start text-left h-auto py-4 px-6"
                onClick={() => handleChoice(choice)}
              >
                <Icon name="ChevronRight" size={20} className="mr-2 flex-shrink-0" />
                <span className="font-body">{choice.text}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DialogueSystem;
