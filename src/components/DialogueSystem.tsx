import { useState, useEffect } from 'react';
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
  character: 'shadow-milk' | 'black-sapphire' | 'narrator' | 'mysterious-stranger' | 'servant';
  text: string;
  choices?: DialogueChoice[];
  background?: string;
}

const dialogueData: DialogueNode[] = [
  {
    id: 'start',
    character: 'narrator',
    text: 'Королевство теней. Мрачный замок утопает в вечной тьме. Выберите путь своей истории...',
    choices: [
      { text: 'История с Shadow Milk (основная ветка)', nextId: 'scene1' },
      { text: 'Исследовать замок самостоятельно', nextId: 'explore_castle' },
      { text: 'Встреча с таинственным незнакомцем', nextId: 'stranger_intro' }
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
    character: 'black-sapphire',
    text: '*обнимает отца в ответ* Отец... я тоже чувствую это. *прижимается ближе*',
    choices: [
      { text: 'Продолжить', nextId: 'intimate_moment1' }
    ]
  },
  {
    id: 'intimate_moment1',
    character: 'shadow-milk',
    text: '*целует в лоб* Мой драгоценный сапфир... *его руки обнимают крепче* Ты не представляешь, как долго я этого ждал. *шепчет на ухо* Останься со мной... навсегда.',
    choices: [
      { text: 'Поцеловать в ответ', nextId: 'kiss_scene', affection: 25 },
      { text: 'Просто остаться в объятиях', nextId: 'embrace_ending', affection: 15 },
      { text: 'Сказать что нужно время', nextId: 'slow_down', affection: 5 }
    ]
  },
  {
    id: 'kiss_scene',
    character: 'narrator',
    text: 'Black Sapphire целует Shadow Milk. Их запретная страсть достигает пика. В этот момент время останавливается...',
    choices: [
      { text: 'Продолжить', nextId: 'passionate_path' }
    ]
  },
  {
    id: 'passionate_path',
    character: 'shadow-milk',
    text: '*задыхаясь* Ты... мой. Только мой. *тени вокруг них танцуют в экстазе* Никто не разлучит нас.',
    choices: [
      { text: 'Согласиться полностью', nextId: 'obsessive_ending', affection: 30 },
      { text: 'Попросить сохранить рассудок', nextId: 'balanced_love_ending', affection: 20 }
    ]
  },
  {
    id: 'obsessive_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Одержимость. Black Sapphire полностью отдаётся чувствам Shadow Milk. Они становятся неразлучны, их страсть не знает границ. Королевство погружается в вечную тьму, но им всё равно — они есть друг у друга.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'balanced_love_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Запретная любовь. Black Sapphire и Shadow Milk находят баланс между страстью и разумом. Их отношения запретны, но они учатся контролировать свои чувства. Вместе они правят королевством теней.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'embrace_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Тихая близость. Black Sapphire и Shadow Milk остаются в объятиях. Их любовь нежная, без крайностей. Они находят покой друг в друге, храня свою тайну от мира.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'slow_down',
    character: 'shadow-milk',
    text: '*отпускает немного* Конечно... *нервно смеётся* Я могу ждать. Для тебя я буду ждать вечность. *но в его глазах видна нетерпеливость*',
    choices: [
      { text: 'Продолжить', nextId: 'tension_building' }
    ]
  },
  {
    id: 'tension_building',
    character: 'narrator',
    text: 'Дни проходят. Напряжение между вами растёт. Shadow Milk всё более нетерпелив. Однажды ночью он приходит в вашу комнату...',
    choices: [
      { text: 'Впустить его', nextId: 'night_visit', affection: 15 },
      { text: 'Попросить уйти', nextId: 'rejection_scene', affection: -15 }
    ]
  },
  {
    id: 'night_visit',
    character: 'shadow-milk',
    text: '*входит в комнату* Я больше не могу ждать... *приближается к кровати* Позволь мне... хотя бы побыть рядом.',
    choices: [
      { text: 'Позволить лечь рядом', nextId: 'bed_scene', affection: 20 },
      { text: 'Предложить поговорить', nextId: 'talk_night', affection: 10 }
    ]
  },
  {
    id: 'bed_scene',
    character: 'shadow-milk',
    text: '*ложится рядом, обнимает* Как же хорошо... *гладит волосы* Ты такой тёплый... *его дыхание учащается* Можно... поцеловать?',
    choices: [
      { text: 'Разрешить', nextId: 'intimate_night', affection: 25 },
      { text: 'Только обнимать', nextId: 'cuddle_ending', affection: 15 }
    ]
  },
  {
    id: 'intimate_night',
    character: 'narrator',
    text: 'КОНЦОВКА: Ночь страсти. То, что происходит этой ночью, навсегда изменит их отношения. Они переступают все границы. Утром они просыпаются в объятиях друг друга — больше нет пути назад.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'cuddle_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Нежность теней. Они засыпают в объятиях друг друга. Это становится их ритуалом — ночи вместе, без слов, просто близость. Их любовь тихая, но глубокая.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'talk_night',
    character: 'black-sapphire',
    text: 'Отец, давайте поговорим. О ваших чувствах, о моих... о том, что это значит.',
    choices: [
      { text: 'Продолжить', nextId: 'honest_conversation' }
    ]
  },
  {
    id: 'honest_conversation',
    character: 'shadow-milk',
    text: '*садится* Хорошо... *серьёзно* Я люблю тебя. Не как отец должен любить сына. Я... хочу тебя. Владеть тобой. Это неправильно, я знаю, но я не могу остановиться.',
    choices: [
      { text: 'Признаться во взаимности', nextId: 'mutual_confession', affection: 20 },
      { text: 'Объяснить почему это сложно', nextId: 'complex_feelings', affection: 5 },
      { text: 'Отвергнуть', nextId: 'gentle_rejection', affection: -20 }
    ]
  },
  {
    id: 'mutual_confession',
    character: 'black-sapphire',
    text: 'Отец... я тоже чувствую это. Я пытался бороться, но... *берёт его за руку* Может быть, это судьба.',
    choices: [
      { text: 'Продолжить', nextId: 'balanced_love_ending' }
    ]
  },
  {
    id: 'complex_feelings',
    character: 'black-sapphire',
    text: 'Я... не знаю, что чувствую. Я люблю вас как отца. Но эти новые чувства... они пугают меня. Мне нужно время понять.',
    choices: [
      { text: 'Продолжить', nextId: 'uncertainty_ending' }
    ]
  },
  {
    id: 'uncertainty_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Неопределённость. Black Sapphire и Shadow Milk остаются в подвешенном состоянии. Их чувства есть, но они не решаются действовать. Каждый день — испытание их воли.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'gentle_rejection',
    character: 'black-sapphire',
    text: 'Отец, простите... но я не могу ответить на эти чувства. Вы для меня — отец. Только отец.',
    choices: [
      { text: 'Продолжить', nextId: 'heartbreak_path' }
    ]
  },
  {
    id: 'heartbreak_path',
    character: 'shadow-milk',
    text: '*слёзы на глазах* Я... понимаю. *смеётся сквозь боль* Конечно. Как глупо с моей стороны... *встаёт* Прости, что потревожил.',
    choices: [
      { text: 'Обнять на прощание', nextId: 'bittersweet_ending', affection: 5 },
      { text: 'Отпустить его', nextId: 'distant_ending', affection: -10 }
    ]
  },
  {
    id: 'bittersweet_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Горькая нежность. Shadow Milk принимает отказ. Они остаются близки, но граница восстановлена. Иногда ночами Shadow Milk смотрит на дверь комнаты сына, но больше никогда не переступает её.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'distant_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Холодная дистанция. После отказа Shadow Milk отдаляется. Они становятся почти чужими. В замке царит ледяное молчание. Оба страдают в одиночестве.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'rejection_scene',
    character: 'shadow-milk',
    text: '*останавливается у двери* Ты... отвергаешь меня? Снова? *его голос дрожит от боли и гнева*',
    choices: [
      { text: 'Объяснить мягко', nextId: 'gentle_rejection' },
      { text: 'Сказать жёстко', nextId: 'harsh_rejection', affection: -25 }
    ]
  },
  {
    id: 'harsh_rejection',
    character: 'black-sapphire',
    text: 'Хватит! Это неправильно! Вы — мой отец! Перестаньте!',
    choices: [
      { text: 'Продолжить', nextId: 'rage_ending' }
    ]
  },
  {
    id: 'rage_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Ярость теней. Shadow Milk не выдерживает жестокого отказа. Его безумие берёт верх. Он изгоняет Black Sapphire из королевства. Оба остаются сломленными и одинокими.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'boundaries',
    character: 'black-sapphire',
    text: 'Отец, стойте. *мягко отстраняется* Я ценю вашу любовь, но... мы должны соблюдать границы.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_frustrated' }
    ]
  },
  {
    id: 'shadow_frustrated',
    character: 'shadow-milk',
    text: '*стискивает зубы* Границы? *смеётся нервно* Хорошо. Я... уважаю твоё решение. *но его руки дрожат от сдерживаемого желания*',
    choices: [
      { text: 'Уйти', nextId: 'boundaries_maintained' },
      { text: 'Поцеловать в щёку напоследок', nextId: 'teasing_path', affection: 5 }
    ]
  },
  {
    id: 'boundaries_maintained',
    character: 'narrator',
    text: 'КОНЦОВКА: Соблюдение границ. Black Sapphire твёрд в своём решении. Shadow Milk страдает, но уважает это. Их отношения остаются близкими, но платоническими. Напряжение никогда не уходит полностью.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'teasing_path',
    character: 'shadow-milk',
    text: '*замирает от прикосновения губ к щеке* Ты... *хватает за руку* Не играй со мной так. Это жестоко.',
    choices: [
      { text: 'Извиниться и уйти', nextId: 'boundaries_maintained' },
      { text: 'Остаться рядом', nextId: 'dangerous_game', affection: 10 }
    ]
  },
  {
    id: 'dangerous_game',
    character: 'narrator',
    text: 'Black Sapphire играет с огнём. Каждый день — новые намёки, лёгкие прикосновения, взгляды. Shadow Milk на грани...',
    choices: [
      { text: 'Продолжить игру', nextId: 'teasing_ending', affection: 15 },
      { text: 'Остановиться', nextId: 'boundaries_maintained' }
    ]
  },
  {
    id: 'teasing_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Опасная игра. Black Sapphire постоянно дразнит Shadow Milk, балансируя на грани. Shadow Milk страдает от желания, но это их извращённый танец. Однажды он не выдержит...',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'reassure',
    character: 'black-sapphire',
    text: 'Отец, никого нет важнее вас. *берёт его руки* Вы — единственный в моей жизни.',
    choices: [
      { text: 'Продолжить', nextId: 'possessive_moment' }
    ]
  },
  {
    id: 'possessive_moment',
    character: 'shadow-milk',
    text: '*притягивает к себе* Докажи. *его глаза горят* Покажи мне, что я единственный.',
    choices: [
      { text: 'Поцеловать', nextId: 'proof_kiss', affection: 20 },
      { text: 'Обнять крепко', nextId: 'proof_embrace', affection: 15 },
      { text: 'Сказать словами', nextId: 'verbal_reassurance', affection: 8 }
    ]
  },
  {
    id: 'proof_kiss',
    character: 'narrator',
    text: 'Black Sapphire целует Shadow Milk страстно, доказывая свою преданность. Shadow Milk стонет от удовольствия...',
    choices: [
      { text: 'Продолжить', nextId: 'possessive_ending' }
    ]
  },
  {
    id: 'possessive_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Собственность. Black Sapphire становится полной собственностью Shadow Milk. Он носит метку отца — ошейник из теней. Они неразделимы. Shadow Milk невероятно доволен.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'proof_embrace',
    character: 'shadow-milk',
    text: '*обнимает в ответ* Хорошо... *удовлетворённо* Мой мальчик. Только мой.',
    choices: [
      { text: 'Продолжить', nextId: 'devoted_ending' }
    ]
  },
  {
    id: 'devoted_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Преданность. Black Sapphire посвящает себя Shadow Milk. Они проводят каждый момент вместе. Их любовь глубока и взаимна, хоть и нездорова.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'verbal_reassurance',
    character: 'black-sapphire',
    text: 'Вы — смысл моего существования, отец. Я живу только для вас.',
    choices: [
      { text: 'Продолжить', nextId: 'devoted_ending' }
    ]
  },
  {
    id: 'ask_time',
    character: 'black-sapphire',
    text: 'Отец, мне нужно время. Чтобы разобраться в своих чувствах.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_impatient' }
    ]
  },
  {
    id: 'shadow_impatient',
    character: 'shadow-milk',
    text: '*ревниво* Время?! ВРЕМЯ?! *тени вспыхивают* Кто-то другой занимает твои мысли! Признайся!',
    choices: [
      { text: 'Убедить что никого нет', nextId: 'calm_jealousy', affection: 5 },
      { text: 'Не оправдываться', nextId: 'stand_ground', affection: -10 },
      { text: 'Признаться в чувствах', nextId: 'confession_under_pressure', affection: 15 }
    ]
  },
  {
    id: 'calm_jealousy',
    character: 'black-sapphire',
    text: 'Никого нет! *берёт за лицо* Смотрите на меня. Только вы. Просто дайте мне время ПОНЯТЬ это.',
    choices: [
      { text: 'Продолжить', nextId: 'jealousy_calmed' }
    ]
  },
  {
    id: 'jealousy_calmed',
    character: 'shadow-milk',
    text: '*успокаивается* Хорошо... *гладит щёку* Но не заставляй меня ждать слишком долго. Моё терпение... ограничено.',
    choices: [
      { text: 'Поцеловать в лоб', nextId: 'sweet_moment', affection: 10 },
      { text: 'Кивнуть', nextId: 'tension_continues', affection: 3 }
    ]
  },
  {
    id: 'sweet_moment',
    character: 'shadow-milk',
    text: '*закрывает глаза от прикосновения* Ты... такой нежный. *обнимает* Я подожду. Для тебя.',
    choices: [
      { text: 'Продолжить', nextId: 'slow_burn_ending' }
    ]
  },
  {
    id: 'slow_burn_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Медленное тление. Их отношения развиваются медленно, каждый момент близости ценен. Shadow Milk учится терпению. Их любовь растёт естественно.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'tension_continues',
    character: 'narrator',
    text: 'КОНЦОВКА: Напряжённое ожидание. Black Sapphire обдумывает чувства, Shadow Milk ждёт. Воздух между ними наэлектризован. Каждая встреча — испытание.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'stand_ground',
    character: 'black-sapphire',
    text: 'Я не обязан оправдываться. Вы не владеете мной.',
    choices: [
      { text: 'Продолжить', nextId: 'power_struggle' }
    ]
  },
  {
    id: 'power_struggle',
    character: 'shadow-milk',
    text: '*прижимает к стене* Не владею? *опасно тихо* Ты МОЙ сын. Ты живёшь в МОЁМ замке. Ты... *почти касается губами* ...будешь моим.',
    choices: [
      { text: 'Поддаться', nextId: 'forced_intimacy', affection: 10 },
      { text: 'Оттолкнуть', nextId: 'conflict_ending', affection: -25 }
    ]
  },
  {
    id: 'forced_intimacy',
    character: 'narrator',
    text: 'Shadow Milk целует Black Sapphire жёстко, требовательно. Black Sapphire сопротивляется только мгновение...',
    choices: [
      { text: 'Продолжить', nextId: 'dominant_ending' }
    ]
  },
  {
    id: 'dominant_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Доминирование. Shadow Milk берёт то, что хочет. Black Sapphire подчиняется. Их отношения основаны на власти и подчинении. Тёмные, но страстные.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'conflict_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Борьба воль. Black Sapphire отталкивает Shadow Milk. Начинается война между ними. Ни один не уступает. Замок разрывается от их конфликта.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'confession_under_pressure',
    character: 'black-sapphire',
    text: '*срывается* Хорошо! Я чувствую к вам больше чем должен! Вы довольны?!',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_triumphant' }
    ]
  },
  {
    id: 'shadow_triumphant',
    character: 'shadow-milk',
    text: '*улыбается победно* Наконец-то... *обнимает* Признание — первый шаг. *шепчет* Теперь я знаю, что ты мой.',
    choices: [
      { text: 'Продолжить', nextId: 'reluctant_love_ending' }
    ]
  },
  {
    id: 'reluctant_love_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Вынужденное признание. Black Sapphire признался под давлением. Теперь Shadow Milk знает правду и не отпустит. Их любовь реальна, но началась с принуждения.',
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
  },
  {
    id: 'explore_castle',
    character: 'narrator',
    text: 'Black Sapphire решает исследовать замок. Тёмные коридоры полны тайн. Куда направиться?',
    choices: [
      { text: 'В библиотеку теней', nextId: 'library' },
      { text: 'В тронный зал', nextId: 'throne_room' },
      { text: 'В сад ночных цветов', nextId: 'garden' }
    ]
  },
  {
    id: 'library',
    character: 'narrator',
    text: 'Древняя библиотека хранит запретные знания. На столе лежит открытая книга о прошлом королевства...',
    choices: [
      { text: 'Прочитать книгу', nextId: 'read_book' },
      { text: 'Услышать шаги за спиной', nextId: 'library_encounter' }
    ]
  },
  {
    id: 'read_book',
    character: 'narrator',
    text: 'В книге описано, как Shadow Milk стал владыкой теней. Его прошлое полно боли и предательства. Внезапно книга захлопывается сама собой...',
    choices: [
      { text: 'Продолжить чтение', nextId: 'book_reveal', affection: -5 },
      { text: 'Отойти от книги', nextId: 'library_encounter' }
    ]
  },
  {
    id: 'book_reveal',
    character: 'narrator',
    text: 'Вы узнаёте шокирующую правду: Shadow Milk когда-то был обычным существом, превращённым в шута силами тьмы. Его безумие — результат проклятия...',
    choices: [
      { text: 'Вернуться к отцу с этим знанием', nextId: 'confront_with_truth' },
      { text: 'Продолжить исследование', nextId: 'explore_castle' }
    ]
  },
  {
    id: 'confront_with_truth',
    character: 'black-sapphire',
    text: 'Отец... я знаю правду о вашем прошлом. О проклятии.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_reaction_truth' }
    ]
  },
  {
    id: 'shadow_reaction_truth',
    character: 'shadow-milk',
    text: '*замирает, его смех стихает* Ты... нашёл библиотеку. *голос становится опасно тихим* Теперь ты знаешь слишком много, мой мальчик.',
    choices: [
      { text: 'Предложить помощь в снятии проклятия', nextId: 'help_curse', affection: 20 },
      { text: 'Использовать знание как преимущество', nextId: 'use_knowledge', affection: -15 }
    ]
  },
  {
    id: 'help_curse',
    character: 'shadow-milk',
    text: '*удивлён* Ты... хочешь помочь мне? *на мгновение его безумие исчезает* Никто никогда... Спасибо, мой драгоценный сапфир.',
    choices: [
      { text: 'Хорошая концовка: Поиск лекарства', nextId: 'good_ending' }
    ]
  },
  {
    id: 'good_ending',
    character: 'narrator',
    text: 'Black Sapphire и Shadow Milk вместе начинают искать способ снять проклятие. Их отношения становятся здоровее. Впереди долгий путь, но они вместе.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'use_knowledge',
    character: 'shadow-milk',
    text: '*глаза вспыхивают яростью* Ты СМЕЕШЬ использовать это против меня?! *тени вокруг сгущаются* Я покажу тебе настоящую тьму!',
    choices: [
      { text: 'Плохая концовка: Власть теней', nextId: 'bad_ending' }
    ]
  },
  {
    id: 'bad_ending',
    character: 'narrator',
    text: 'Shadow Milk в ярости заточает Black Sapphire в теневой темнице. Королевство погружается во тьму. Их отношения разрушены навсегда.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'library_encounter',
    character: 'servant',
    text: 'Простите, молодой господин. Владыка теней ищет вас. Он... в плохом настроении.',
    choices: [
      { text: 'Пойти к отцу', nextId: 'scene1', affection: 5 },
      { text: 'Попросить слугу помочь скрыться', nextId: 'hide_path' }
    ]
  },
  {
    id: 'hide_path',
    character: 'servant',
    text: '*шепотом* Есть секретный проход в сад. Но если владыка узнает, что я помогал... *дрожит от страха*',
    choices: [
      { text: 'Воспользоваться проходом', nextId: 'garden', affection: -8 },
      { text: 'Не подвергать слугу опасности', nextId: 'scene1', affection: 3 }
    ]
  },
  {
    id: 'throne_room',
    character: 'narrator',
    text: 'Величественный тронный зал пуст. Трон Shadow Milk окутан тенями. Вы чувствуете его присутствие...',
    choices: [
      { text: 'Сесть на трон', nextId: 'sit_throne' },
      { text: 'Покинуть зал', nextId: 'explore_castle' }
    ]
  },
  {
    id: 'sit_throne',
    character: 'shadow-milk',
    text: '*появляется из теней* Ах, мой дерзкий мальчик хочет примерить мою корону? *смеётся* Как очаровательно... и опасно.',
    choices: [
      { text: 'Объяснить, что это была ошибка', nextId: 'apologize_throne', affection: -5 },
      { text: 'Заявить о своих правах', nextId: 'claim_throne', affection: -20 }
    ]
  },
  {
    id: 'apologize_throne',
    character: 'black-sapphire',
    text: 'Простите, отец. Я просто... хотел понять, каково это — быть владыкой.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_understands' }
    ]
  },
  {
    id: 'shadow_understands',
    character: 'shadow-milk',
    text: 'Однажды ты унаследуешь мою власть, мой сапфир. Но сейчас... *протягивает руку* Иди сюда.',
    choices: [
      { text: 'Взять его руку', nextId: 'scene2_close', affection: 10 },
      { text: 'Остаться у трона', nextId: 'stay', affection: -3 }
    ]
  },
  {
    id: 'claim_throne',
    character: 'shadow-milk',
    text: '*ярость* ПРЕДАТЕЛЬ! Ты хочешь занять МОЁ место?! *тени атакуют*',
    choices: [
      { text: 'Принять наказание', nextId: 'punishment_ending' }
    ]
  },
  {
    id: 'punishment_ending',
    character: 'narrator',
    text: 'Shadow Milk наказывает Black Sapphire за дерзость. Их отношения становятся токсичными. Королевство погружается в хаос.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'garden',
    character: 'narrator',
    text: 'Сад ночных цветов светится странным фиолетовым светом. Здесь царит относительный покой. Вы видите незнакомца среди цветов...',
    choices: [
      { text: 'Подойти к незнакомцу', nextId: 'stranger_intro' },
      { text: 'Остаться наедине с мыслями', nextId: 'garden_alone' },
      { text: 'Прогуляться по саду', nextId: 'garden_walk' }
    ]
  },
  {
    id: 'garden_walk',
    character: 'narrator',
    text: 'Black Sapphire расправляет крылья, наслаждаясь тишиной сада. Лунный свет отражается в его демонских крылышках...',
    choices: [
      { text: 'Взлететь над садом', nextId: 'fly_garden', affection: 0 },
      { text: 'Присесть у фонтана', nextId: 'fountain_scene' }
    ]
  },
  {
    id: 'fly_garden',
    character: 'narrator',
    text: 'Sapphire взлетает, его крылья раскрываются полностью. Внизу слышится восхищённый смех...',
    choices: [
      { text: 'Посмотреть вниз', nextId: 'shadow_watches_flying' }
    ]
  },
  {
    id: 'shadow_watches_flying',
    character: 'shadow-milk',
    text: '*смотрит снизу* Мой прекрасный летучий мышонок... *восхищённо* Как изящно ты летаешь. Спустись ко мне.',
    choices: [
      { text: 'Спуститься к отцу', nextId: 'land_near_shadow', affection: 8 },
      { text: 'Продолжить летать', nextId: 'tease_flying', affection: -5 }
    ]
  },
  {
    id: 'land_near_shadow',
    character: 'shadow-milk',
    text: '*когда Sapphire приземляется* Какой же ты красивый в полёте... *тянется к крыльям* Позволь мне прикоснуться к ним.',
    choices: [
      { text: 'Разрешить погладить крылья', nextId: 'wings_touch', affection: 15 },
      { text: 'Отказать мягко', nextId: 'wings_refuse', affection: 3 },
      { text: 'Сложить крылья', nextId: 'wings_hide', affection: -3 }
    ]
  },
  {
    id: 'wings_touch',
    character: 'black-sapphire',
    text: '*краснеет* Хорошо, отец... но... осторожно. Они очень чувствительны.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_strokes_wings' }
    ]
  },
  {
    id: 'shadow_strokes_wings',
    character: 'shadow-milk',
    text: '*нежно проводит пальцами по крыльям* Такие мягкие... такие нежные... *шепчет* Мой летучий мышонок дрожит от моих прикосновений?',
    choices: [
      { text: 'Признаться что приятно', nextId: 'wings_pleasure', affection: 20 },
      { text: 'Попросить остановиться', nextId: 'wings_too_much', affection: 5 },
      { text: 'Тихо застонать', nextId: 'wings_intimate', affection: 25 }
    ]
  },
  {
    id: 'wings_pleasure',
    character: 'black-sapphire',
    text: '*прикрывает глаза* Да... это... приятно, отец. *крылья слегка подрагивают*',
    choices: [
      { text: 'Продолжить', nextId: 'garden_intimate_wings' }
    ]
  },
  {
    id: 'garden_intimate_wings',
    character: 'shadow-milk',
    text: '*продолжает гладить, всё смелее* Я знал, что тебе понравится... *приближается сзади* Твои крылышки реагируют на каждое моё движение. Они такие чувствительные, мой мышонок...',
    choices: [
      { text: 'Позволить продолжить', nextId: 'wings_more_garden', affection: 30 },
      { text: 'Попросить быть нежнее', nextId: 'wings_gentle', affection: 15 }
    ]
  },
  {
    id: 'wings_more_garden',
    character: 'shadow-milk',
    text: '*гладит обеими руками по всей длине крыльев, массирует основание* Ты так красиво реагируешь... *его дыхание учащается* Я мог бы делать это вечно, мой летучий мышонок.',
    choices: [
      { text: 'Развернуться к нему', nextId: 'face_to_face_garden', affection: 25 },
      { text: 'Остаться так', nextId: 'wings_sensual', affection: 30 }
    ]
  },
  {
    id: 'face_to_face_garden',
    character: 'shadow-milk',
    text: '*смотрит в глаза* Ты доверяешь мне свои крылья... самое чувствительное место. *берёт за руки* Это значит больше, чем ты думаешь.',
    choices: [
      { text: 'Поцеловать его', nextId: 'garden_kiss_wings', affection: 30 },
      { text: 'Обнять', nextId: 'garden_hug_wings', affection: 20 }
    ]
  },
  {
    id: 'garden_kiss_wings',
    character: 'narrator',
    text: 'КОНЦОВКА: Интимность крыльев. После того как Sapphire позволил Shadow Milk касаться его крыльев, их связь стала ещё глубже. Shadow Milk единственный кто знает эту тайну — и использует её, чтобы дарить удовольствие своему мышонку.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'garden_hug_wings',
    character: 'shadow-milk',
    text: '*обнимает, крылья Sapphire окутывают их обоих* Ты укрываешь нас своими крыльями... *тихо* Мой защитник.',
    choices: [
      { text: 'Продолжить', nextId: 'wings_cocoon_ending' }
    ]
  },
  {
    id: 'wings_sensual',
    character: 'narrator',
    text: 'КОНЦОВКА: Чувствительность. Shadow Milk открывает секрет чувствительности крыльев Sapphire. Теперь это их особая интимность — прикосновения к крыльям заменяют слова. Только Shadow Milk имеет право касаться крыльев своего мышонка.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'wings_gentle',
    character: 'shadow-milk',
    text: '*смягчает прикосновения* Как скажешь, мой чувствительный мышонок. *нежно гладит* Я буду бережным с твоими прекрасными крылышками.',
    choices: [
      { text: 'Развернуться к нему', nextId: 'face_to_face_garden', affection: 15 },
      { text: 'Остаться в объятиях', nextId: 'garden_tender_ending' }
    ]
  },
  {
    id: 'wings_too_much',
    character: 'black-sapphire',
    text: '*дрожит* Отец, остановитесь... это слишком... чувствительно...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_stops_wings' }
    ]
  },
  {
    id: 'shadow_stops_wings',
    character: 'shadow-milk',
    text: '*убирает руки* Прости, мой мышонок. *целует в лоб* Я увлёкся. Спасибо, что позволил хотя бы ненадолго.',
    choices: [
      { text: 'Обнять его', nextId: 'garden_hug_wings', affection: 10 },
      { text: 'Вернуться в замок', nextId: 'explore_castle' }
    ]
  },
  {
    id: 'wings_intimate',
    character: 'black-sapphire',
    text: '*тихо стонет* Ах... отец... *крылья дрожат сильнее*',
    choices: [
      { text: 'Продолжить', nextId: 'wings_discovery' }
    ]
  },
  {
    id: 'wings_discovery',
    character: 'shadow-milk',
    text: '*замирает* Ты... *гладит увереннее* ...реагируешь так сильно? *хриплым голосом* Мой мышонок, твои крылья — эрогенная зона?',
    choices: [
      { text: 'Признаться смущённо', nextId: 'wings_sensitive_truth', affection: 25 },
      { text: 'Попросить остановиться', nextId: 'shadow_stops_wings', affection: 10 }
    ]
  },
  {
    id: 'wings_sensitive_truth',
    character: 'black-sapphire',
    text: '*краснеет сильно* Да... поэтому я не даю их трогать... это... очень интимно...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_possessive_wings' }
    ]
  },
  {
    id: 'shadow_possessive_wings',
    character: 'shadow-milk',
    text: '*довольный* То есть я первый, кому ты разрешил? *гладит ещё нежнее* Мой мышонок доверяет мне самое интимное... Я буду единственным, кто прикасается к ним.',
    choices: [
      { text: 'Кивнуть', nextId: 'wings_bonding', affection: 30 },
      { text: 'Попросить продолжить', nextId: 'wings_climax_garden', affection: 35 }
    ]
  },
  {
    id: 'wings_bonding',
    character: 'narrator',
    text: 'КОНЦОВКА: Доверие крыльев. Sapphire доверил Shadow Milk самое чувствительное — свои крылья. Это стало их особой связью. Shadow Milk обожает гладить крылышки своего мышонка, а Sapphire позволяет только ему.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'wings_climax_garden',
    character: 'narrator',
    text: 'КОНЦОВКА: Экстаз летучего мышонка. Shadow Milk открывает, что может доставлять Sapphire невероятное удовольствие только прикосновениями к крыльям. Это становится их тайным ритуалом — в саду, под луной, Shadow Milk ласкает чувствительные крылышки своего мышонка.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'wings_refuse',
    character: 'black-sapphire',
    text: '*мягко* Прости, отец... они слишком чувствительны. Я не готов.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_disappointed_wings' }
    ]
  },
  {
    id: 'shadow_disappointed_wings',
    character: 'shadow-milk',
    text: '*опускает руку, явно разочарован* ...Понимаю. *вздыхает* Однажды ты позволишь мне, мой мышонок?',
    choices: [
      { text: 'Может быть позже', nextId: 'wings_promise', affection: 5 },
      { text: 'Вряд ли', nextId: 'wings_never', affection: -5 }
    ]
  },
  {
    id: 'wings_promise',
    character: 'shadow-milk',
    text: '*улыбается* Я буду ждать этого дня. *бережно* И заслужу это право.',
    choices: [
      { text: 'Продолжить', nextId: 'slow_burn_ending' }
    ]
  },
  {
    id: 'wings_never',
    character: 'shadow-milk',
    text: '*грустно* ...Понимаю. *отворачивается* Пойдём обратно.',
    choices: [
      { text: 'Продолжить', nextId: 'tension_continues' }
    ]
  },
  {
    id: 'wings_hide',
    character: 'black-sapphire',
    text: '*быстро складывает крылья за спину* Нет, извините.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_hurt_wings' }
    ]
  },
  {
    id: 'shadow_hurt_wings',
    character: 'shadow-milk',
    text: '*обижен* Даже мне ты не позволяешь? *голос холодеет* Своему отцу?',
    choices: [
      { text: 'Объяснить про чувствительность', nextId: 'explain_wings_sensitivity', affection: 5 },
      { text: 'Стоять на своём', nextId: 'refuse_firmly_wings', affection: -10 }
    ]
  },
  {
    id: 'explain_wings_sensitivity',
    character: 'black-sapphire',
    text: 'Они очень чувствительны, отец. Когда к ним прикасаются... это слишком интимно.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_understands_wings' }
    ]
  },
  {
    id: 'shadow_understands_wings',
    character: 'shadow-milk',
    text: '*понимает* О... *смотрит на крылья с новым интересом* Интимно, говоришь? *шаг ближе* Тем более хочу прикоснуться.',
    choices: [
      { text: 'Позволить', nextId: 'wings_touch', affection: 15 },
      { text: 'Всё равно отказать', nextId: 'refuse_firmly_wings', affection: -5 }
    ]
  },
  {
    id: 'refuse_firmly_wings',
    character: 'black-sapphire',
    text: 'Нет. Это моя граница.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_accepts_boundary' }
    ]
  },
  {
    id: 'shadow_accepts_boundary',
    character: 'shadow-milk',
    text: '*после паузы* ...Хорошо. *натянуто улыбается* Я уважаю твои границы, мой мышонок.',
    choices: [
      { text: 'Продолжить', nextId: 'boundaries_maintained' }
    ]
  },
  {
    id: 'tease_flying',
    character: 'black-sapphire',
    text: '*смеётся сверху* Поймайте меня сначала, отец!',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_watches_lovingly' }
    ]
  },
  {
    id: 'shadow_watches_lovingly',
    character: 'shadow-milk',
    text: '*смотрит с обожанием* Игривый мышонок... *смеётся* Хорошо, но когда ты устанешь и спустишься — я потребую свою награду!',
    choices: [
      { text: 'Спуститься', nextId: 'land_near_shadow', affection: 10 },
      { text: 'Улететь в замок', nextId: 'explore_castle' }
    ]
  },
  {
    id: 'fountain_scene',
    character: 'narrator',
    text: 'В глубине сада находится древний фонтан. Вода светится мягким светом...',
    choices: [
      { text: 'Исследовать фонтан', nextId: 'fountain_magic' },
      { text: 'Вернуться', nextId: 'garden_walk' }
    ]
  },
  {
    id: 'fountain_magic',
    character: 'narrator',
    text: 'Это Фонтан Истины. Его вода показывает истинные чувства...',
    choices: [
      { text: 'Выпить воды', nextId: 'truth_revealed', affection: 10 },
      { text: 'Не пить', nextId: 'garden_walk' }
    ]
  },
  {
    id: 'truth_revealed',
    character: 'narrator',
    text: 'Вода показывает правду — вы любите Shadow Milk не как отца...',
    choices: [
      { text: 'Принять истину', nextId: 'fountain_confession', affection: 20 },
      { text: 'Отвергнуть', nextId: 'deny_feelings', affection: -10 }
    ]
  },
  {
    id: 'garden_alone',
    character: 'black-sapphire',
    text: '*размышляет* Моя жизнь... мой отец... всё так сложно. Я люблю его, но его поведение...',
    choices: [
      { text: 'Вернуться в замок', nextId: 'explore_castle' },
      { text: 'Заметить Shadow Milk', nextId: 'garden_encounter' }
    ]
  },
  {
    id: 'stranger_intro',
    character: 'mysterious-stranger',
    text: 'Приветствую, наследник теней. Я путешественник из далёких земель. Я знаю о твоей ситуации... и могу помочь.',
    choices: [
      { text: 'Выслушать предложение', nextId: 'stranger_offer' },
      { text: 'Прогнать незнакомца', nextId: 'reject_stranger' }
    ]
  },
  {
    id: 'stranger_offer',
    character: 'mysterious-stranger',
    text: 'У меня есть артефакт, способный разорвать узы проклятия. Твой отец станет свободен... но цена велика. Ты должен покинуть королевство навсегда.',
    choices: [
      { text: 'Принять предложение', nextId: 'freedom_ending', affection: -30 },
      { text: 'Отказаться', nextId: 'reject_stranger', affection: 15 }
    ]
  },
  {
    id: 'freedom_ending',
    character: 'narrator',
    text: 'Black Sapphire принимает артефакт и освобождает Shadow Milk от проклятия. Затем покидает королевство навсегда. Shadow Milk остаётся один, свободный, но разбитый утратой сына.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'reject_stranger',
    character: 'black-sapphire',
    text: 'Нет. Уходите. Я не нуждаюсь в вашей помощи.',
    choices: [
      { text: 'Прогнать незнакомца', nextId: 'stranger_leaves' }
    ]
  },
  {
    id: 'stranger_leaves',
    character: 'mysterious-stranger',
    text: '*кланяется* Как пожелаешь, наследник. Но предложение останется в силе. *растворяется в тенях*',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_appears_jealous' }
    ]
  },
  {
    id: 'shadow_appears_jealous',
    character: 'shadow-milk',
    text: '*внезапно появляется из теней, глаза горят яростью* КТО это был?! *хватает за плечи* Что этот МУЖЧИНА хотел от тебя?!',
    choices: [
      { text: 'Объяснить честно', nextId: 'explain_stranger', affection: 10 },
      { text: 'Сказать что ничего важного', nextId: 'downplay_stranger', affection: 5 },
      { text: 'Спросить почему он ревнует', nextId: 'question_jealousy', affection: 15 }
    ]
  },
  {
    id: 'explain_stranger',
    character: 'black-sapphire',
    text: 'Это был незнакомец. Он предлагал помочь разорвать ваше проклятие, но я отказался. Я не покину вас, отец.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_relieved_possessive' }
    ]
  },
  {
    id: 'shadow_relieved_possessive',
    character: 'shadow-milk',
    text: '*обнимает крепко, почти удушающе* Мой мальчик... *дрожащим голосом* Ты выбрал меня... *целует в макушку* Никогда не разговаривай с другими мужчинами. НИКОГДА. *прижимает к себе* Только я... только мой мышонок.',
    choices: [
      { text: 'Согласиться', nextId: 'possessive_accepted', affection: 20 },
      { text: 'Сказать что это слишком', nextId: 'resist_control', affection: -10 },
      { text: 'Обнять в ответ', nextId: 'mutual_possession', affection: 25 }
    ]
  },
  {
    id: 'possessive_accepted',
    character: 'black-sapphire',
    text: '*прижимается* Хорошо, отец. Только вы. Я ваш.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_marks_possession' }
    ]
  },
  {
    id: 'shadow_marks_possession',
    character: 'shadow-milk',
    text: '*целует страстно* Мой... *ведёт руку к крыльям* Позволь мне отметить тебя. Чтобы все знали — ты принадлежишь мне. *смотрит в глаза* Твои крылья... дай мне прикоснуться к ним.',
    choices: [
      { text: 'Позволить коснуться крыльев', nextId: 'marking_wings', affection: 30 },
      { text: 'Предложить другую метку', nextId: 'other_marking', affection: 20 },
      { text: 'Отказать', nextId: 'refuse_marking', affection: -15 }
    ]
  },
  {
    id: 'marking_wings',
    character: 'shadow-milk',
    text: '*нежно гладит крылья, затем целует основание* Теперь мои метки на твоих крыльях... *прикусывает нежную кожу у основания крыла* Каждый, кто увидит синяки здесь, поймёт — у тебя есть хозяин.',
    choices: [
      { text: 'Застонать', nextId: 'wings_marked_intimate', affection: 35 },
      { text: 'Терпеть', nextId: 'wings_marked_stoic', affection: 25 }
    ]
  },
  {
    id: 'wings_marked_intimate',
    character: 'black-sapphire',
    text: '*стонет тихо* А-ах... отец... крылья... они так чувствительны... *дрожит*',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_aroused_wings' }
    ]
  },
  {
    id: 'shadow_aroused_wings',
    character: 'shadow-milk',
    text: '*дыхание учащается* Твой стон... *продолжает целовать и покусывать крылья* Мой чувствительный мышонок... Я буду единственным, кто слышит эти звуки. *оставляет следы по всему основанию крыльев*',
    choices: [
      { text: 'Позволить продолжить', nextId: 'wings_fully_marked', affection: 40 },
      { text: 'Попросить остановиться', nextId: 'enough_marks', affection: 20 }
    ]
  },
  {
    id: 'wings_fully_marked',
    character: 'narrator',
    text: 'КОНЦОВКА: Помеченные крылья. Shadow Milk оставляет множество меток на чувствительных крыльях Sapphire. Теперь каждый раз, когда Sapphire расправляет крылья, он чувствует эти следы прикосновений отца. Они стали физическим напоминанием о владении.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'enough_marks',
    character: 'black-sapphire',
    text: '*дрожит* Достаточно, отец... я уже весь ваш...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_satisfied_marking' }
    ]
  },
  {
    id: 'shadow_satisfied_marking',
    character: 'shadow-milk',
    text: '*отстраняется, любуясь своей работой* Прекрасно... *гладит помеченные крылья* Теперь ты действительно мой. *нежно* И все будут знать.',
    choices: [
      { text: 'Продолжить', nextId: 'possessive_love_ending' }
    ]
  },
  {
    id: 'possessive_love_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Собственническая любовь. После инцидента с незнакомцем Shadow Milk стал ещё более собственническим. Sapphire принял это — он действительно принадлежит отцу, душой и телом. Их любовь токсична, но они счастливы в ней.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'wings_marked_stoic',
    character: 'black-sapphire',
    text: '*сжимает кулаки, терпит боль и удовольствие* Делайте что хотите... я ваш...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_satisfied_marking' }
    ]
  },
  {
    id: 'other_marking',
    character: 'black-sapphire',
    text: 'Крылья слишком... личное. Может... шею? Или ключицы?',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_marks_neck' }
    ]
  },
  {
    id: 'shadow_marks_neck',
    character: 'shadow-milk',
    text: '*кивает* Шея прекрасно подойдёт. *наклоняется к шее* Все будут видеть. *начинает целовать и покусывать* Мой... только мой...',
    choices: [
      { text: 'Наклонить голову давая доступ', nextId: 'neck_fully_marked', affection: 30 },
      { text: 'Обнять его', nextId: 'intimate_marking', affection: 25 }
    ]
  },
  {
    id: 'neck_fully_marked',
    character: 'narrator',
    text: 'Shadow Milk покрывает шею Sapphire множеством меток — от подбородка до ключиц. Назавтра все в замке будут знать, что наследник принадлежит владыке теней...',
    choices: [
      { text: 'Продолжить', nextId: 'possessive_love_ending' }
    ]
  },
  {
    id: 'intimate_marking',
    character: 'shadow-milk',
    text: '*между поцелуями* Обнимаешь меня... *целует шею* ...пока я метю тебя... *прикусывает* Мой послушный мышонок.',
    choices: [
      { text: 'Продолжить', nextId: 'possessive_love_ending' }
    ]
  },
  {
    id: 'refuse_marking',
    character: 'black-sapphire',
    text: 'Нет. Я не вещь, которую можно метить.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_angry_refused' }
    ]
  },
  {
    id: 'shadow_angry_refused',
    character: 'shadow-milk',
    text: '*отпускает резко, в глазах боль и ярость* Не вещь?! *смеётся горько* Тогда ЗАЧЕМ ты сказал что ты мой?! *отворачивается* Уходи. Сейчас же.',
    choices: [
      { text: 'Попытаться объясниться', nextId: 'apologize_marking', affection: 5 },
      { text: 'Уйти', nextId: 'conflict_ending', affection: -30 }
    ]
  },
  {
    id: 'apologize_marking',
    character: 'black-sapphire',
    text: 'Прости... я не то имел в виду... я просто... это слишком быстро...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_calms_down' }
    ]
  },
  {
    id: 'shadow_calms_down',
    character: 'shadow-milk',
    text: '*глубокий вдох* ...*поворачивается* Тогда скажи мне. *серьёзно* Ты мой или нет? Честно.',
    choices: [
      { text: 'Да, я ваш', nextId: 'reconciliation', affection: 20 },
      { text: 'Не знаю', nextId: 'uncertainty_path', affection: 0 },
      { text: 'Нет', nextId: 'conflict_ending', affection: -40 }
    ]
  },
  {
    id: 'reconciliation',
    character: 'shadow-milk',
    text: '*обнимает бережно* Прости за вспышку. *целует лоб* Я просто... не выношу мысли о том, что кто-то другой может забрать тебя.',
    choices: [
      { text: 'Пообещать что никто не заберёт', nextId: 'promise_loyalty', affection: 25 },
      { text: 'Обнять в ответ', nextId: 'silent_comfort', affection: 15 }
    ]
  },
  {
    id: 'promise_loyalty',
    character: 'black-sapphire',
    text: 'Никто не заберёт меня от вас. Обещаю. Я выбираю вас. Каждый день.',
    choices: [
      { text: 'Продолжить', nextId: 'mutual_love_ending' }
    ]
  },
  {
    id: 'mutual_love_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Взаимный выбор. После испытания ревностью они укрепили свою связь. Sapphire добровольно выбирает Shadow Milk каждый день. Shadow Milk учится доверять. Их любовь становится крепче.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'silent_comfort',
    character: 'narrator',
    text: 'Они стоят в обнимку, без слов понимая друг друга. Ревность Shadow Milk утихает в объятиях Sapphire...',
    choices: [
      { text: 'Продолжить', nextId: 'slow_burn_ending' }
    ]
  },
  {
    id: 'uncertainty_path',
    character: 'shadow-milk',
    text: '*вздыхает* Не знаешь... *грустная улыбка* Понимаю. *гладит по голове* Тогда у нас ещё есть время разобраться.',
    choices: [
      { text: 'Продолжить', nextId: 'slow_burn_ending' }
    ]
  },
  {
    id: 'mutual_possession',
    character: 'black-sapphire',
    text: '*обнимает крепко* Я ваш... *прижимается* ...а вы мой. Так ведь?',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_surprised_happy' }
    ]
  },
  {
    id: 'resist_control',
    character: 'black-sapphire',
    text: '*отстраняется* Это слишком, отец. Я не могу обещать никогда не разговаривать с другими. Это нездоровая ревность.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_rejects_boundary' }
    ]
  },
  {
    id: 'shadow_rejects_boundary',
    character: 'shadow-milk',
    text: '*хватает за подбородок* Нездоровая? *усмехается* Мой мальчик, вся наша связь нездорова. *приближается* Но ты не можешь уйти. Ты нужен мне.',
    choices: [
      { text: 'Поддаться', nextId: 'give_in_control', affection: 10 },
      { text: 'Вырваться', nextId: 'fight_control', affection: -20 }
    ]
  },
  {
    id: 'give_in_control',
    character: 'black-sapphire',
    text: '*опускает взгляд* ...Хорошо. Я не буду разговаривать с другими.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_marks_possession' }
    ]
  },
  {
    id: 'fight_control',
    character: 'black-sapphire',
    text: '*вырывается* Нет! Я не игрушка! Я не позволю вам контролировать меня!',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_furious' }
    ]
  },
  {
    id: 'shadow_furious',
    character: 'shadow-milk',
    text: '*тени взрываются вокруг* НЕ ИГРУШКА?! *голос эхом* Тогда что ты для меня?! НИЧТО?! *приближается опасно* Скажи прямо сейчас — ты мой или нет?!',
    choices: [
      { text: 'Признать что его', nextId: 'forced_admission', affection: 5 },
      { text: 'Отказаться', nextId: 'conflict_ending', affection: -35 },
      { text: 'Убежать', nextId: 'escape_attempt', affection: -30 }
    ]
  },
  {
    id: 'forced_admission',
    character: 'black-sapphire',
    text: '*со слезами* Да... да, я ваш... только успокойтесь, пожалуйста...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_calms_possessive' }
    ]
  },
  {
    id: 'shadow_calms_possessive',
    character: 'shadow-milk',
    text: '*тени успокаиваются, обнимает* Вот так... *гладит по голове* Мой хороший мальчик. *целует слёзы* Не плачь. Я не хотел пугать. Просто люблю слишком сильно.',
    choices: [
      { text: 'Прильнуть к нему', nextId: 'toxic_comfort', affection: 15 },
      { text: 'Отстраниться', nextId: 'distance_created', affection: -10 }
    ]
  },
  {
    id: 'toxic_comfort',
    character: 'narrator',
    text: 'КОНЦОВКА: Токсичная любовь. Sapphire прощает вспышки Shadow Milk, принимая их как часть его любви. Их отношения нездоровы, но Sapphire не может уйти. Любовь и страх переплетаются.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'distance_created',
    character: 'black-sapphire',
    text: '*отстраняется* Мне нужно время... подумать...',
    choices: [
      { text: 'Продолжить', nextId: 'distant_ending' }
    ]
  },
  {
    id: 'escape_attempt',
    character: 'narrator',
    text: 'Sapphire пытается убежать, расправив крылья для полёта...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_catches' }
    ]
  },
  {
    id: 'shadow_catches',
    character: 'shadow-milk',
    text: '*тени ловят крылья, притягивают обратно* Ты думал УЛЕТЕТЬ от меня?! *хватает за крылья жёстко* Эти крылья... *сжимает* ...больше не твои. Они мои. ТЫ мой!',
    choices: [
      { text: 'Закричать от боли', nextId: 'wings_hurt', affection: -25 },
      { text: 'Умолять остановиться', nextId: 'beg_release', affection: -15 }
    ]
  },
  {
    id: 'wings_hurt',
    character: 'black-sapphire',
    text: '*кричит* БОЛЬНО! Отпустите! Вы делаете больно крыльям!',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_realizes' }
    ]
  },
  {
    id: 'shadow_realizes',
    character: 'shadow-milk',
    text: '*резко отпускает, ужас в глазах* Я... что я... *смотрит на свои руки* Твои крылья... я повредил твои крылья... *падает на колени* Прости... прости мой мышонок...',
    choices: [
      { text: 'Простить', nextId: 'forgive_hurt', affection: 10 },
      { text: 'Не простить', nextId: 'unforgivable_ending', affection: -30 },
      { text: 'Улететь пока можешь', nextId: 'escape_success', affection: -25 }
    ]
  },
  {
    id: 'forgive_hurt',
    character: 'black-sapphire',
    text: '*трогает крылья* Я... я в порядке. Не сильно... *опускается рядом* Вы не хотели...',
    choices: [
      { text: 'Продолжить', nextId: 'redemption_moment' }
    ]
  },
  {
    id: 'redemption_moment',
    character: 'shadow-milk',
    text: '*обнимает аккуратно, дрожит* Никогда больше. Клянусь. Я никогда не причиню боль твоим крыльям. *целует повреждённые места бережно* Прости... прости...',
    choices: [
      { text: 'Обнять в ответ', nextId: 'healing_moment', affection: 20 },
      { text: 'Остаться настороже', nextId: 'cautious_acceptance', affection: 10 }
    ]
  },
  {
    id: 'healing_moment',
    character: 'narrator',
    text: 'КОНЦОВКА: Момент осознания. Shadow Milk осознал, что зашёл слишком далеко. Он клянётся быть лучше. Sapphire даёт ему второй шанс. Их путь к здоровым отношениям начинается с этого момента раскаяния.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'cautious_acceptance',
    character: 'narrator',
    text: 'КОНЦОВКА: Осторожное доверие. Sapphire прощает, но не забывает. Shadow Milk должен заслужить доверие обратно. Они пытаются построить что-то лучшее, но шрамы остаются.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'unforgivable_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Непростительно. Sapphire не может простить боль, причинённую его чувствительным крыльям. Он уходит от Shadow Milk. Владыка теней остаётся один, разрушенный осознанием того, что уничтожил единственное, что любил.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'escape_success',
    character: 'narrator',
    text: 'КОНЦОВКА: Побег. Несмотря на боль, Sapphire расправляет крылья и улетает из замка. Shadow Milk не преследует — он слишком потрясён собственными действиями. Sapphire свободен, но одинок.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'beg_release',
    character: 'black-sapphire',
    text: '*со слезами* Пожалуйста... отпустите крылья... пожалуйста, отец...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_realizes' }
    ]
  },
  {
    id: 'downplay_stranger',
    character: 'black-sapphire',
    text: 'Никто важный. Просто путник. Я прогнал его.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_suspicious' }
    ]
  },
  {
    id: 'shadow_suspicious',
    character: 'shadow-milk',
    text: '*прищуривается* Никто важный? *приближается* Тогда почему он подходил именно к тебе? *берёт за подбородок* И почему ты ОДИН в саду, где каждый может приблизиться?',
    choices: [
      { text: 'Сказать правду', nextId: 'explain_stranger', affection: 5 },
      { text: 'Защититься', nextId: 'defend_independence', affection: -5 },
      { text: 'Успокоить его', nextId: 'reassure_shadow', affection: 10 }
    ]
  },
  {
    id: 'defend_independence',
    character: 'black-sapphire',
    text: 'Я имею право гулять один. И разговаривать с кем хочу.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_rejects_boundary' }
    ]
  },
  {
    id: 'reassure_shadow',
    character: 'black-sapphire',
    text: '*кладёт руку на его щёку* Никто мне не нужен, кроме вас. Это был просто странник. Я отослал его.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_calms_possessive' }
    ]
  },
  {
    id: 'question_jealousy',
    character: 'black-sapphire',
    text: 'Вы... ревнуете? *смотрит в глаза* Почему? Я же ваш сын...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_confession_jealousy' }
    ]
  },
  {
    id: 'shadow_confession_jealousy',
    character: 'shadow-milk',
    text: '*отпускает, отворачивается* Ты не понимаешь... *сжимает кулаки* Когда я вижу кого-то рядом с тобой... *поворачивается резко* ...я хочу разорвать их на части. *подходит ближе* Ты МОЙ. Не сын. МОЙ.',
    choices: [
      { text: 'Спросить в каком смысле', nextId: 'clarify_relationship', affection: 15 },
      { text: 'Сказать что вы его', nextId: 'confirm_his', affection: 20 },
      { text: 'Отстраниться испуганно', nextId: 'scared_of_intensity', affection: -10 }
    ]
  },
  {
    id: 'clarify_relationship',
    character: 'black-sapphire',
    text: 'Мой... в каком смысле? Как сын? Или... *краснеет* ...как-то иначе?',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_reveals_feelings' }
    ]
  },
  {
    id: 'shadow_reveals_feelings',
    character: 'shadow-milk',
    text: '*смеётся темно* Как сын? *приближается вплотную* Нет, мой мышонок. Я хочу тебя как МУЖЧИНА хочет мужчину. *касается щеки* Как возлюбленный. Как вторая половина. Навсегда.',
    choices: [
      { text: 'Признаться в ответных чувствах', nextId: 'mutual_confession', affection: 30 },
      { text: 'Сказать что нужно время', nextId: 'need_time', affection: 10 },
      { text: 'Отказать', nextId: 'reject_advances', affection: -20 }
    ]
  },
  {
    id: 'mutual_confession',
    character: 'black-sapphire',
    text: '*прижимается лбом* Я тоже... я тоже хочу вас. Не как отца. Как... *выдыхает* ...как мужчину. Как любовь.',
    choices: [
      { text: 'Продолжить', nextId: 'first_real_kiss' }
    ]
  },
  {
    id: 'first_real_kiss',
    character: 'shadow-milk',
    text: '*целует страстно, но нежно* Наконец... *между поцелуями* ...ты признал... *обнимает* ...мой мышонок... моя любовь...',
    choices: [
      { text: 'Углубить поцелуй', nextId: 'passionate_kiss', affection: 35 },
      { text: 'Обнять крепко', nextId: 'tender_embrace', affection: 30 }
    ]
  },
  {
    id: 'passionate_kiss',
    character: 'narrator',
    text: 'КОНЦОВКА: Взаимное признание. После ревности к незнакомцу они наконец признались в истинных чувствах. Больше нет отца и сына — только двое влюблённых. Их запретная любовь расцветает.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'tender_embrace',
    character: 'narrator',
    text: 'КОНЦОВКА: Нежное принятие. Они обнимаются, наконец честные друг с другом. Больше нет лжи и недосказанности. Только любовь — странная, запретная, но настоящая.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'need_time',
    character: 'black-sapphire',
    text: 'Это... многое. Мне нужно время подумать. Переварить это.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_patient' }
    ]
  },
  {
    id: 'reject_advances',
    character: 'black-sapphire',
    text: 'Нет. Это неправильно. Вы мой отец. Я не могу...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_heartbroken' }
    ]
  },
  {
    id: 'shadow_heartbroken',
    character: 'shadow-milk',
    text: '*отшатывается* Не можешь... *голос ломается* Понял. *тени сгущаются вокруг него* Тогда уходи. Я не хочу тебя видеть.',
    choices: [
      { text: 'Уйти', nextId: 'heartbreak_ending' },
      { text: 'Попытаться утешить', nextId: 'comfort_despite_rejection', affection: 5 }
    ]
  },
  {
    id: 'heartbreak_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Разбитое сердце. Отказ Sapphire разбивает Shadow Milk. Он замыкается в себе, становится ещё более безумным. Sapphire остаётся в замке, но между ними пропасть. Их отношения разрушены.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'comfort_despite_rejection',
    character: 'black-sapphire',
    text: '*осторожно обнимает* Я не хочу причинять вам боль... я люблю вас... просто... как отца...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_accepts_platonic' }
    ]
  },
  {
    id: 'shadow_accepts_platonic',
    character: 'shadow-milk',
    text: '*обнимает в ответ, плачет тихо* ...Достаточно. Если ты рядом... достаточно. *прижимает* Не уходи хотя бы.',
    choices: [
      { text: 'Пообещать остаться', nextId: 'platonic_ending', affection: 15 }
    ]
  },
  {
    id: 'platonic_ending',
    character: 'narrator',
    text: 'КОНЦОВКА: Платоническая любовь. Shadow Milk принимает, что Sapphire любит его только как отца. Это причиняет боль, но он предпочитает иметь сына рядом, чем потерять его совсем. Их отношения остаются близкими, но не романтическими.',
    choices: [
      { text: 'Начать заново', nextId: 'start' }
    ]
  },
  {
    id: 'confirm_his',
    character: 'black-sapphire',
    text: '*смотрит прямо в глаза* Я ваш. Полностью. Только ваш.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_overjoyed' }
    ]
  },
  {
    id: 'scared_of_intensity',
    character: 'black-sapphire',
    text: '*отступает* Вы пугаете меня... эта интенсивность...',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_tries_calm' }
    ]
  },
  {
    id: 'shadow_tries_calm',
    character: 'shadow-milk',
    text: '*глубокий вдох, пытается успокоиться* Прости... *протягивает руку* Я не хочу пугать тебя. Просто... *опускает руку* ...ты для меня всё.',
    choices: [
      { text: 'Взять его руку', nextId: 'give_chance', affection: 15 },
      { text: 'Отказать', nextId: 'distant_ending', affection: -15 }
    ]
  },
  {
    id: 'give_chance',
    character: 'black-sapphire',
    text: '*берёт руку* Обещайте... быть терпеливым. Это всё новое для меня.',
    choices: [
      { text: 'Продолжить', nextId: 'shadow_patient' }
    ]
  }
];

interface DialogueSystemProps {
  onClose: () => void;
}

const DialogueSystem = ({ onClose }: DialogueSystemProps) => {
  const [currentNodeId, setCurrentNodeId] = useState(() => {
    const saved = localStorage.getItem('novelProgress');
    return saved ? JSON.parse(saved).nodeId : 'start';
  });
  const [affectionLevel, setAffectionLevel] = useState(() => {
    const saved = localStorage.getItem('novelProgress');
    return saved ? JSON.parse(saved).affection : 50;
  });
  const [history, setHistory] = useState<string[]>([]);
  const [showSaveMenu, setShowSaveMenu] = useState(false);

  useEffect(() => {
    const saveData = {
      nodeId: currentNodeId,
      affection: affectionLevel,
      timestamp: Date.now()
    };
    localStorage.setItem('novelProgress', JSON.stringify(saveData));
  }, [currentNodeId, affectionLevel]);

  const currentNode = dialogueData.find(node => node.id === currentNodeId);

  if (!currentNode) return null;

  const handleChoice = (choice: DialogueChoice) => {
    setHistory(prev => [...prev, currentNodeId]);
    if (choice.affection) {
      setAffectionLevel(prev => Math.max(0, Math.min(100, prev + choice.affection)));
    }
    setCurrentNodeId(choice.nextId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousNode = history[history.length - 1];
      setCurrentNodeId(previousNode);
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const resetProgress = () => {
    localStorage.removeItem('novelProgress');
    setCurrentNodeId('start');
    setAffectionLevel(50);
    setHistory([]);
    setShowSaveMenu(false);
  };

  const getSaveSlots = () => {
    const slots = [];
    for (let i = 1; i <= 3; i++) {
      const slot = localStorage.getItem(`novelSave${i}`);
      slots.push(slot ? JSON.parse(slot) : null);
    }
    return slots;
  };

  const saveToSlot = (slotIndex: number) => {
    const saveData = {
      nodeId: currentNodeId,
      affection: affectionLevel,
      timestamp: Date.now(),
      slotName: `Сохранение ${slotIndex}`
    };
    localStorage.setItem(`novelSave${slotIndex}`, JSON.stringify(saveData));
    setShowSaveMenu(false);
  };

  const loadFromSlot = (slotIndex: number) => {
    const slot = localStorage.getItem(`novelSave${slotIndex}`);
    if (slot) {
      const data = JSON.parse(slot);
      setCurrentNodeId(data.nodeId);
      setAffectionLevel(data.affection);
      setHistory([]);
      setShowSaveMenu(false);
    }
  };

  const getCharacterName = (character: string) => {
    switch (character) {
      case 'shadow-milk': return 'Shadow Milk';
      case 'black-sapphire': return 'Black Sapphire';
      case 'mysterious-stranger': return 'Таинственный незнакомец';
      case 'servant': return 'Слуга';
      default: return '';
    }
  };

  const getCharacterIcon = (character: string) => {
    switch (character) {
      case 'shadow-milk': return 'Drama';
      case 'black-sapphire': return 'Gem';
      case 'mysterious-stranger': return 'Users';
      case 'servant': return 'User';
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
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSaveMenu(!showSaveMenu)} title="Меню сохранений">
              <Icon name="Save" size={24} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleBack} disabled={history.length === 0} title="Назад">
              <Icon name="Undo" size={24} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>
        </div>

        {showSaveMenu && (
          <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/30 p-6 mb-4 animate-fade-in">
            <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Icon name="Save" size={24} className="text-primary" />
              Сохранения
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {getSaveSlots().map((slot, index) => (
                <div key={index} className="space-y-2">
                  <Button
                    className="w-full bg-primary/20 hover:bg-primary/40 border-2 border-primary/40 hover:border-primary text-foreground h-auto py-3"
                    onClick={() => saveToSlot(index + 1)}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Слот {index + 1}
                  </Button>
                  {slot && (
                    <Button
                      className="w-full bg-accent/20 hover:bg-accent/40 border-2 border-accent/40 hover:border-accent text-foreground text-xs py-2"
                      onClick={() => loadFromSlot(index + 1)}
                    >
                      <Icon name="Upload" size={14} className="mr-1" />
                      Загрузить
                      <br />
                      <span className="text-xs opacity-70">
                        {new Date(slot.timestamp).toLocaleDateString()}
                      </span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-destructive/20 hover:bg-destructive/40 border-2 border-destructive/40 hover:border-destructive text-foreground"
              onClick={resetProgress}
            >
              <Icon name="RotateCcw" size={20} className="mr-2" />
              Начать с начала
            </Button>
          </Card>
        )}

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