import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
}

const characters: Character[] = [
  {
    id: 'shadow-milk',
    name: 'Shadow Milk',
    title: 'Владыка Теней',
    description: 'Мастер лжи и обмана, правящий королевством теней, где царит тьма и ложь. Его характер непредсказуем, он часто смеётся и очень капризен. Не терпит отказов и сильно ревнив.',
    image: 'https://v3b.fal.media/files/b/elephant/Ds3riAQ0kry15D6SauRqt_output.png'
  },
  {
    id: 'black-sapphire',
    name: 'Black Sapphire',
    title: 'Наследник Теней',
    description: 'Главный герой истории. Горячо любит и уважает своего отца. Уже не тот ребёнок, которым был когда-то — он вырос и повзрослел.',
    image: 'https://v3b.fal.media/files/b/elephant/Ds3riAQ0kry15D6SauRqt_output.png'
  }
];

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0033] via-[#2d1b4e] to-[#1a0033] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDEzOSwgMCwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Icon name="Crown" size={48} className="text-primary animate-glow" />
            <h1 className="text-5xl md:text-7xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Королевство Теней
            </h1>
            <Icon name="Crown" size={48} className="text-primary animate-glow" />
          </div>
          <p className="text-xl text-muted-foreground font-body">
            Визуальная новелла о тьме, обмане и запретных чувствах
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-semibold text-center mb-8 flex items-center justify-center gap-3">
            <Icon name="Users" size={32} className="text-accent" />
            Персонажи
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {characters.map((character, index) => (
              <Card 
                key={character.id}
                className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 overflow-hidden hover:border-primary/60 transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={character.image} 
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon 
                      name={character.id === 'shadow-milk' ? 'Drama' : 'Gem'} 
                      size={28} 
                      className="text-primary" 
                    />
                    <h3 className="text-2xl font-display font-bold">{character.name}</h3>
                  </div>
                  
                  <p className="text-accent text-sm font-semibold mb-3">{character.title}</p>
                  
                  <p className="text-muted-foreground leading-relaxed font-body">
                    {character.description}
                  </p>
                  
                  <Button 
                    className="w-full mt-6 bg-primary hover:bg-primary/80 text-primary-foreground font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCharacter(character.id);
                    }}
                  >
                    <Icon name="BookOpen" size={20} className="mr-2" />
                    Узнать больше
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm border-2 border-accent/30 p-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl font-display font-semibold mb-6 flex items-center gap-3">
            <Icon name="Scroll" size={32} className="text-accent" />
            О новелле
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              Shadow Milk — мастер лжи и обмана, владеющий королевством теней, где царит тьма и ложь. 
              Он — шут, чей характер непредсказуем, и он часто смеётся. Очень капризный, не любит отказов, 
              обожает прикосновения и невероятно ревнив.
            </p>
            <p>
              Black Sapphire — его горячо любимый сын, который уже вырос и больше не является тем ребёнком. 
              Shadow Milk начал проводить с ним больше времени, и его чувства к сыну переросли во что-то большее.
            </p>
            <p className="text-primary font-semibold">
              История о запретной любви, тьме и сложных отношениях в мрачном королевстве теней...
            </p>
          </div>
          
          <Button className="w-full mt-8 bg-accent hover:bg-accent/80 text-accent-foreground text-lg py-6 font-semibold">
            <Icon name="Play" size={24} className="mr-2" />
            Начать историю
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
