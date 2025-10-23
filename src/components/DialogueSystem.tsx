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
      { text: 'Остаться наедине с мыслями', nextId: 'garden_alone' }
    ]
  },
  {
    id: 'garden_alone',
    character: 'black-sapphire',
    text: '*размышляет* Моя жизнь... мой отец... всё так сложно. Я люблю его, но его поведение...',
    choices: [
      { text: 'Вернуться в замок', nextId: 'explore_castle' },
      { text: 'Заметить незнакомца', nextId: 'stranger_intro' }
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
    text: 'Нет. Я не покину отца. Мы найдём другой способ.',
    choices: [
      { text: 'Вернуться к отцу', nextId: 'scene1', affection: 10 },
      { text: 'Продолжить исследование', nextId: 'explore_castle' }
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