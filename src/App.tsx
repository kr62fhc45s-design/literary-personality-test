import { useMemo, useState } from 'react';

type Trait = 'imagination' | 'sensitivity' | 'rebellion' | 'warmth' | 'solitude' | 'order';
type Stage = 'intro' | 'quiz' | 'result';
type Scores = Record<Trait, number>;

type Question = {
  scene: string;
  text: string;
  trait: Trait;
  low: string;
  high: string;
};

type Author = {
  name: string;
  en: string;
  place: string;
  years: string;
  archetype: string;
  mark: string;
  vector: Scores;
  colors: [string, string, string];
  summary: string;
  inner: string;
  relation: string;
  gift: string;
  shadow: string;
  practice: string;
  reading: string;
};

type LiteraryPath = {
  book: string;
  figure: string;
  road: string;
  proof: string;
  answer: string;
  route: [string, string, string];
  readingNote: string;
};

const traits: Record<Trait, { name: string; hint: string }> = {
  imagination: { name: '想象', hint: '把现实推开一扇门' },
  sensitivity: { name: '感受', hint: '听见细微的回声' },
  rebellion: { name: '锋芒', hint: '不轻易接受现成答案' },
  warmth: { name: '温度', hint: '向人与生活靠近' },
  solitude: { name: '独处', hint: '在内部世界蓄力' },
  order: { name: '秩序', hint: '为混沌建立结构' },
};

const questions: Question[] = [
  { scene: '旧物 · 周日下午', text: '整理抽屉时，你翻到一张十年前的电影票。', trait: 'sensitivity', low: '确认没用，随手丢掉', high: '停下来，重新走进那一天' },
  { scene: '通勤 · 清晨 8:20', text: '熟悉的路口突然封路，你必须绕进一条从没走过的小巷。', trait: 'imagination', low: '只想尽快回到原路线', high: '开始猜想巷子里的故事' },
  { scene: '会议 · 周一上午', text: '所有人都在赞成一个方案，但你看见了一个关键漏洞。', trait: 'rebellion', low: '先保留，避免扫兴', high: '会清楚地当场指出' },
  { scene: '消息 · 深夜 00:47', text: '朋友只发来一句“没事，我睡了”，语气却和平时不同。', trait: 'warmth', low: '尊重对方，不再追问', high: '会再陪一会儿，确认状态' },
  { scene: '周末 · 空白的一天', text: '难得没有任何安排，也没有人约你。', trait: 'solitude', low: '很快想找人或活动填满', high: '独处反而让我恢复能量' },
  { scene: '旅行 · 出发前夜', text: '明天要去一座陌生城市，你会如何准备？', trait: 'order', low: '到达以后再随机决定', high: '路线、时间和备选都列好' },
  { scene: '雨天 · 咖啡馆', text: '邻桌两个人沉默地坐了很久，其中一人忽然把伞留下离开。', trait: 'imagination', low: '只是普通一幕，不会多想', high: '脑中已经出现几种前因后果' },
  { scene: '聚餐 · 六个人', text: '席间有人讲了一个刻薄的玩笑，大家都笑了。', trait: 'rebellion', low: '不破坏气氛，保持沉默', high: '会让对方知道这并不好笑' },
  { scene: '房间 · 凌晨两点', text: '一段很久以前的对话突然重新浮现在脑中。', trait: 'sensitivity', low: '很快把它按下去睡觉', high: '会反复体会当时没说出口的话' },
  { scene: '协作 · 截止日前', text: '团队文件命名混乱、版本四散，但内容仍在推进。', trait: 'order', low: '能找到就行，先继续做', high: '会先建立一套清晰规则' },
  { scene: '傍晚 · 独自散步', text: '手机只剩 5% 的电，而你还要走四十分钟。', trait: 'solitude', low: '担心失联，尽量省电联系别人', high: '正好关机，享受无人抵达的时间' },
  { scene: '争执 · 熟悉的人', text: '对方说了重话，半小时后带着你喜欢的食物回来。', trait: 'warmth', low: '问题没说清楚，食物没有意义', high: '能读懂这份笨拙的和解' },
  { scene: '书店 · 偶然翻页', text: '你读到一句无法完全理解、却很美的话。', trait: 'imagination', low: '需要弄懂作者到底在说什么', high: '愿意让它保持模糊和神秘' },
  { scene: '规则 · 日常流程', text: '一个沿用多年的规定明显低效，但没人愿意改。', trait: 'rebellion', low: '先按规定做，减少麻烦', high: '会尝试越过它并证明新办法' },
  { scene: '告别 · 车站月台', text: '列车开走后，你通常会怎么做？', trait: 'sensitivity', low: '马上转身，开始下一件事', high: '站一会儿，让告别真正结束' },
  { scene: '家中 · 临时来客', text: '朋友说十分钟后到，而你的房间还很乱。', trait: 'order', low: '真实一点也没关系', high: '会迅速让空间恢复体面' },
  { scene: '选择 · 两张邀请函', text: '一边是热闹的行业聚会，一边是独自看期待已久的电影。', trait: 'solitude', low: '更怕错过人与机会', high: '更想守住只属于自己的晚上' },
  { scene: '街角 · 小小意外', text: '陌生人的纸袋破了，橙子滚了一地，而你正要迟到。', trait: 'warmth', low: '示意一下，继续赶路', high: '会停下来帮忙捡完' },
];

const authors: Author[] = [
  { name:'鲁迅', en:'LU XUN', place:'中国', years:'1881—1936', archetype:'清醒的持灯者', mark:'迅', vector:{imagination:2,sensitivity:4,rebellion:5,warmth:2,solitude:4,order:4}, colors:['#171815','#a52b24','#d8c9a9'], summary:'你对虚假的和谐保持警觉，也愿意把目光停在众人回避的地方。你的底色不是冷，而是对“人本可以更好”的固执。', inner:'你的思考常从不适感开始：一句套话、一次随波逐流、一个被忽略的人，都会成为内部追问的入口。你需要真相胜过安慰。', relation:'你不轻易亲近，却会用极深的责任感对待真正信任的人。比起漂亮承诺，你更看重一个人是否诚实、是否在关键时刻站稳。', gift:'洞察结构性的荒谬；在集体沉默时保持清醒；用准确语言刺破含混。', shadow:'锋利有时会先伤到自己。长期处在批判姿态中，容易忘记温柔也能推动改变。', practice:'每周记录一件“仍值得相信的小事”，让判断力与生命力站在同一边。', reading:'《朝花夕拾》' },
  { name:'张爱玲', en:'EILEEN CHANG', place:'中国', years:'1920—1995', archetype:'华丽的解剖师', mark:'爱', vector:{imagination:3,sensitivity:5,rebellion:4,warmth:2,solitude:4,order:4}, colors:['#542d3c','#d1a250','#d9c7b8'], summary:'你能从衣领、语气和餐桌上的停顿，看见一段关系真正的温度。繁华在你眼里从不只是繁华，它总带着裂纹与余味。', inner:'你对细节有近乎本能的记忆力，尤其是那些不体面的、暧昧的、无法公开承认的感受。你不急着美化人性。', relation:'你既渴望理解，又本能地保留退路。你会读懂亲密里的权力与交换，也因此很难对敷衍的浪漫信以为真。', gift:'辨认复杂动机；把微妙感受说得准确；在世俗生活中捕捉戏剧张力。', shadow:'过度清醒可能让你提前退出。你有时用洞察保护自己，却也挡住了真正发生的可能。', practice:'在下结论前，多问一次：“如果对方不是算计，只是笨拙呢？”', reading:'《倾城之恋》' },
  { name:'汪曾祺', en:'WANG ZENGQI', place:'中国', years:'1920—1997', archetype:'人间的慢火', mark:'汪', vector:{imagination:3,sensitivity:4,rebellion:2,warmth:5,solitude:2,order:3}, colors:['#446d58','#d99a3e','#eee2c7'], summary:'你的力量藏在寻常生活里：一碗热汤、一阵植物气味、一个普通人的体面。你相信具体的好，比宏大的正确更接近幸福。', inner:'你擅长把注意力安放在当下，不需要惊天动地的情节也能感到丰盛。感官经验是你理解世界的重要方式。', relation:'你给人的安全感来自不评判。你愿意听小事，也懂得用一顿饭、一次顺手的照料表达在意。', gift:'让紧绷的环境松下来；发现日常之美；以温和方式保存人的尊严。', shadow:'为了保持平和，你可能回避必要的冲突，把自己的需要放得太轻。', practice:'下一次说“都可以”之前，先说出一个真正属于你的偏好。', reading:'《人间草木》' },
  { name:'沈从文', en:'SHEN CONGWEN', place:'中国', years:'1902—1988', archetype:'河流的守梦人', mark:'湘', vector:{imagination:4,sensitivity:5,rebellion:2,warmth:5,solitude:3,order:2}, colors:['#244e55','#b56b42','#d9d1b5'], summary:'你相信土地、记忆与人的本真之间有一条隐秘河流。面对复杂世界，你仍愿意守住未经磨损的善意。', inner:'你的想象不是逃离现实，而是为消逝之物保存形状。环境、气候与人的命运在你心里彼此相连。', relation:'你看重自然、不造作的相处。你愿意长久观察一个人，而不是用迅速的标签决定亲疏。', gift:'保存细微经验；理解人与环境的关系；在粗粝现实中维持诗性。', shadow:'对纯粹的向往，可能让你低估现实中的边界与复杂利益。', practice:'温柔地看世界，也清楚地说“不”；善意不需要以失去边界为代价。', reading:'《边城》' },
  { name:'三毛', en:'SANMAO', place:'中国', years:'1943—1991', archetype:'远方的拾荒者', mark:'漠', vector:{imagination:5,sensitivity:4,rebellion:4,warmth:4,solitude:3,order:1}, colors:['#c26434','#2f7771','#e5cf9d'], summary:'你需要真实地活过，而不只是安全地经过。陌生城市、突如其来的决定和不被理解的选择，都会让你确认自己的生命感。', inner:'自由对你不是姿态，而是呼吸方式。你通过移动、体验和讲述，把孤独变成可以随身携带的家。', relation:'你爱得热烈，也珍惜精神上的同行。关系若变成束缚，你会在留恋与出走之间反复拉扯。', gift:'把经历转化为故事；在陌生处迅速生长；用坦率感染他人。', shadow:'对远方的想象有时会遮住眼前需要修补的部分；强烈感受也可能耗尽自己。', practice:'为自由建立一个小小容器：稳定作息、固定储蓄或长期完成一件事。', reading:'《撒哈拉的故事》' },
  { name:'苏轼', en:'SU SHI', place:'中国', years:'1037—1101', archetype:'旷达的生活家', mark:'坡', vector:{imagination:4,sensitivity:3,rebellion:3,warmth:5,solitude:2,order:3}, colors:['#6b7c3d','#bf5b3b','#e8d8b4'], summary:'你有把困境重新调味的本领。现实不一定遂意，但一顿饭、一轮月亮和几个真朋友，仍能把生活还给你。', inner:'你并非没有失落，只是不愿让失落垄断叙事。你擅长把挫折放进更大的时间和天地里重新理解。', relation:'你自然、坦荡，乐于分享。你希望关系既有真心，也有呼吸感，不喜欢长期沉溺在情绪拉扯中。', gift:'复原力强；能把知识、趣味与生活连在一起；为群体带来松弛和希望。', shadow:'用幽默化解一切时，可能跳过了需要被认真哀伤的部分。', practice:'允许自己有一个不必立刻豁达的晚上，把难过完整地写下来。', reading:'《苏东坡传》' },
  { name:'海明威', en:'ERNEST HEMINGWAY', place:'美国', years:'1899—1961', archetype:'冰山下的行动者', mark:'海', vector:{imagination:2,sensitivity:2,rebellion:4,warmth:3,solitude:3,order:5}, colors:['#233a3d','#bb633e','#d8d1bb'], summary:'你尊重经受过现实检验的东西。与其反复描述恐惧，你更愿意把鞋带系紧，完成眼前必须完成的动作。', inner:'你的感受往往藏在水面以下。简洁、纪律和行动，是你保护脆弱也维持尊严的方式。', relation:'你不擅长冗长解释，却会通过出现、承担和兑现承诺表达爱。你需要直接而可靠的伙伴。', gift:'危机中保持清晰；把复杂问题压缩成可执行步骤；拥有坚韧的完成力。', shadow:'过分崇尚坚强，会让你把求助误认为软弱，也让亲近的人难以看见真实的你。', practice:'当你想说“我没事”时，试着多补充一句具体感受。', reading:'《老人与海》' },
  { name:'卡夫卡', en:'FRANZ KAFKA', place:'奥地利', years:'1883—1924', archetype:'迷宫的记录员', mark:'K', vector:{imagination:5,sensitivity:5,rebellion:3,warmth:1,solitude:5,order:4}, colors:['#232323','#7f8a76','#c8bda7'], summary:'你敏锐地感到个人与庞大系统之间的摩擦。别人习以为常的流程，在你眼里可能显露出荒诞、压迫与变形。', inner:'你有一座复杂的内部法庭，会反复审理自己的选择。想象力把焦虑变成寓言，也帮你为无名感受找到形状。', relation:'你渴望被真正理解，却害怕靠近会带来审判或亏欠。于是你常在写下与撤回之间徘徊。', gift:'看见系统的隐形压力；把不可言说的困境转化为象征；极强的自省能力。', shadow:'内部审判过于严苛时，连普通选择都会变成沉重案件。', practice:'把“必须做到完美”改写为“今天只完成一个可交付版本”。', reading:'《变形记》' },
  { name:'伍尔夫', en:'VIRGINIA WOOLF', place:'英国', years:'1882—1941', archetype:'意识潮汐的潜水者', mark:'W', vector:{imagination:5,sensitivity:5,rebellion:4,warmth:3,solitude:5,order:2}, colors:['#41566f','#a96b7c','#ddd4c5'], summary:'你的意识像潮水，同时容纳此刻、记忆与他人的目光。你珍视属于自己的房间，因为那里是精神真正展开的地方。', inner:'细小刺激会在你内部形成丰富回声。你不满足于事件表面，更关心时间如何流过一个人的心。', relation:'你需要深度交流，也需要大量不被打扰的空间。好的关系应当允许彼此拥有独立的精神生活。', gift:'捕捉意识细节；理解身份与处境的复杂性；为经验创造新的表达形式。', shadow:'过度接收环境信号时，你容易被噪音淹没，难以分辨哪些感受真正属于自己。', practice:'为每天划出二十分钟“无输入时间”，不读、不听，只记录自己的意识。', reading:'《一间自己的房间》' },
  { name:'简·奥斯汀', en:'JANE AUSTEN', place:'英国', years:'1775—1817', archetype:'客厅里的观察家', mark:'A', vector:{imagination:3,sensitivity:4,rebellion:4,warmth:3,solitude:3,order:5}, colors:['#61704b','#a14d54','#e3d8bf'], summary:'你在礼貌的表面下读懂分寸、偏见与自尊。你不需要高声反抗，也能用幽默让不合理之处无所遁形。', inner:'你拥有稳定的判断系统，不容易被华丽表达迷惑。观察、比较与细微反讽，是你理解群体的方式。', relation:'你重视精神匹配、尊重和可靠品格。吸引力可以开始一段关系，但只有判断力能让它走远。', gift:'社交洞察精准；能温和地揭示矛盾；兼具现实感与浪漫能力。', shadow:'高标准与谨慎观察，可能让你在关系开始前就完成整场审判。', practice:'给一个尚未确定的人或想法，多留一次真实相处的机会。', reading:'《傲慢与偏见》' },
  { name:'艾米莉·狄金森', en:'EMILY DICKINSON', place:'美国', years:'1830—1886', archetype:'白房间的宇宙', mark:'D', vector:{imagination:5,sensitivity:5,rebellion:2,warmth:2,solitude:5,order:4}, colors:['#ece6d5','#43545b','#b88c4b'], summary:'你的世界不靠面积衡量。一个花园、一封信、一道光线，都足以在内部展开成关于生命与永恒的宇宙。', inner:'你与微小事物保持高强度联系，语言对你不是装饰，而是接近存在核心的工具。', relation:'你偏爱少而深的连接。比起频繁见面，你更看重那些能穿过距离、真正抵达内心的交流。', gift:'高度凝练的感受力；在微小处看见无限；不依赖外界热闹确认价值。', shadow:'安全的独处可能逐渐变成不必冒险的堡垒，让想被看见的部分长期隐身。', practice:'每周把一个内部作品或真实想法，交给一位可信任的人。', reading:'《狄金森诗选》' },
  { name:'加缪', en:'ALBERT CAMUS', place:'法国', years:'1913—1960', archetype:'正午的反抗者', mark:'C', vector:{imagination:3,sensitivity:3,rebellion:4,warmth:3,solitude:4,order:5}, colors:['#1f4d61','#e1a52e','#e7dec8'], summary:'你知道世界未必提供终极答案，但仍选择认真生活。你的勇气来自清醒：看见荒诞之后，依然承担自由。', inner:'你倾向于把情绪放到更大的哲学坐标里审视。阳光、身体和当下经验，会把你从抽象困境中重新带回生命。', relation:'你重视诚实与并肩，而不是占有。你可以接受差异，但无法长期忍受自欺或推卸责任。', gift:'在不确定中建立个人原则；兼具现实行动与哲学反思；不轻易向虚无投降。', shadow:'持续保持清醒和自持，会让别人误以为你不需要安慰。', practice:'面对无解问题，先做一件让身体确认“我正在活着”的事。', reading:'《西西弗神话》' },
  { name:'博尔赫斯', en:'JORGE LUIS BORGES', place:'阿根廷', years:'1899—1986', archetype:'无限图书馆员', mark:'B', vector:{imagination:5,sensitivity:3,rebellion:2,warmth:2,solitude:5,order:5}, colors:['#263b52','#a8894c','#d8d0bb'], summary:'你着迷于世界背后的结构：镜子、迷宫、循环与偶然。对你而言，一个概念也能拥有史诗般的辽阔。', inner:'你会自然地把经验抽象成模型，再从模型折返现实。阅读不是获取信息，而是进入无数可能人生。', relation:'你通过思想交换靠近一个人。过度情绪化的互动会让你疲惫，清醒而有趣的对话更能建立亲密。', gift:'跨领域连接；构造精巧系统；从有限材料中推演无限可能。', shadow:'概念过于迷人时，你可能站在生活之外解释生活，而没有真正进入。', practice:'在分析一件事之前，先写下身体最直接的三个感受。', reading:'《虚构集》' },
  { name:'马尔克斯', en:'GABRIEL GARCÍA MÁRQUEZ', place:'哥伦比亚', years:'1927—2014', archetype:'热带神话的讲述者', mark:'M', vector:{imagination:5,sensitivity:4,rebellion:3,warmth:5,solitude:3,order:2}, colors:['#e0a329','#267069','#a93832'], summary:'你能让家族传说、日常琐事和奇迹坐在同一张餐桌旁。记忆在你这里不是档案，而是不断生长的生命。', inner:'你用想象消化历史，也用夸张接近真实。越是复杂沉重的经验，你越可能为它找到鲜活的叙述。', relation:'你重视归属、故事和共同记忆。你会记住家人朋友说过的细节，并在很久以后赋予它新的意义。', gift:'强大的叙事感染力；把个人经验连接到时代；让群体重新看见自己的故事。', shadow:'浓烈情感与宏大叙事，有时会掩盖眼前最简单、最需要处理的事实。', practice:'把一个困扰拆成不带比喻的三句话，先解决最具体的一句。', reading:'《百年孤独》' },
  { name:'托尔斯泰', en:'LEO TOLSTOY', place:'俄国', years:'1828—1910', archetype:'道德原野的丈量者', mark:'T', vector:{imagination:3,sensitivity:4,rebellion:3,warmth:5,solitude:3,order:5}, colors:['#40513b','#8a4a37','#d1c19d'], summary:'你关心一个人如何在欲望、责任与良知之间生活。宏大问题对你并不遥远，它们藏在每天怎样对待身边人。', inner:'你有强烈的自我校准需求，会不断检查生活是否与信念一致。成长意味着把理解转化为实践。', relation:'你认真、负责，也容易对自己和亲近的人提出高要求。你希望关系共同走向更诚实、更有意义的生活。', gift:'长期投入复杂问题；兼顾个体命运与整体图景；强烈的实践伦理。', shadow:'道德标准过高时，爱会不知不觉变成纠正，生活也会失去轻盈。', practice:'区分“我真正在乎的原则”与“我希望别人按我的方式生活”。', reading:'《安娜·卡列尼娜》' },
  { name:'陀思妥耶夫斯基', en:'FYODOR DOSTOEVSKY', place:'俄国', years:'1821—1881', archetype:'灵魂深井的勘探者', mark:'D', vector:{imagination:4,sensitivity:5,rebellion:4,warmth:2,solitude:4,order:3}, colors:['#352b35','#8b2f2e','#b5a58e'], summary:'你不回避人心最矛盾的部分：骄傲与卑微、爱与伤害、渴望救赎与主动坠落。你相信真相往往藏在冲突最深处。', inner:'你的思想具有戏剧性，多个声音会在内部激烈辩论。你很少满足于简单解释，因为你知道人并不总是理性一致。', relation:'你追求灵魂层面的坦白，却也可能被强烈情绪吸引。平静的关系偶尔会被你误读为不够深刻。', gift:'直面复杂人性；对痛苦具有深刻理解；能陪伴他人进入艰难问题。', shadow:'把痛苦等同于深度，会让你在已经可以离开的困境里停留太久。', practice:'提醒自己：稳定、平静和善待也可以拥有深度。', reading:'《卡拉马佐夫兄弟》' },
  { name:'莎士比亚', en:'WILLIAM SHAKESPEARE', place:'英国', years:'1564—1616', archetype:'万象舞台的导演', mark:'S', vector:{imagination:5,sensitivity:4,rebellion:3,warmth:5,solitude:2,order:4}, colors:['#5e2941','#c49b3b','#213f4a'], summary:'你能同时理解矛盾双方，看到每个人如何被欲望、误会与时代推上舞台。人性在你眼里从来不是单色。', inner:'你具有多视角思维，能够快速进入不同角色。情绪、语言和情境共同构成你理解世界的戏剧结构。', relation:'你享受互动的火花，也擅长观察关系中的角色变化。你需要既能玩笑又能深谈的人。', gift:'共情跨度大；表达富有戏剧性；能把冲突组织成更完整的故事。', shadow:'太能理解每个立场时，你可能延迟自己的选择，或用角色感遮住真实需求。', practice:'当所有人都可以理解时，仍要问：“此刻我站在哪里？”', reading:'《哈姆雷特》' },
  { name:'王尔德', en:'OSCAR WILDE', place:'爱尔兰', years:'1854—1900', archetype:'美与悖论的叛徒', mark:'W', vector:{imagination:4,sensitivity:3,rebellion:5,warmth:3,solitude:2,order:3}, colors:['#163f3c','#d5ad47','#8e3150'], summary:'你拒绝把生活过成一份正确但乏味的说明书。机智、审美与自由，是你对抗僵化世界的方式。', inner:'你习惯从反面看问题，用悖论揭示被常识遮住的真相。创造自我本身，就是你重要的作品。', relation:'你被聪明、坦率和风格吸引。你希望被欣赏，但也害怕别人只看见你的表演，没有看见代价。', gift:'打破陈词滥调；把观点表达得迷人；在压抑环境中创造自由空间。', shadow:'幽默和华丽可能成为盔甲，让真正的受伤只能躲在谢幕后。', practice:'找一个不需要机智的时刻，用最朴素的话说出真实需要。', reading:'《道林·格雷的画像》' },
  { name:'泰戈尔', en:'RABINDRANATH TAGORE', place:'印度', years:'1861—1941', archetype:'晨光中的歌者', mark:'T', vector:{imagination:5,sensitivity:5,rebellion:2,warmth:5,solitude:3,order:2}, colors:['#ce8138','#4f745b','#e9d7ad'], summary:'你容易在自然、爱与精神经验之间感到连通。你的温柔不是回避现实，而是相信生命仍有更宽广的尺度。', inner:'直觉和诗性是你的重要认知方式。你会从风、树影和一次相遇里，感到超越日常功利的意义。', relation:'你倾向于给予空间，也看重灵魂上的自由。真正的爱在你看来不是占有，而是让彼此更完整。', gift:'安抚而不简化痛苦；创造连结感；用美感唤回人的开放状态。', shadow:'相信和谐时，可能低估具体矛盾，或用宽容绕过必要边界。', practice:'把抽象的爱落到一个明确行动，也把不接受的部分说清楚。', reading:'《飞鸟集》' },
  { name:'玛格丽特·杜拉斯', en:'MARGUERITE DURAS', place:'法国', years:'1914—1996', archetype:'沉默的欲望书写者', mark:'D', vector:{imagination:4,sensitivity:5,rebellion:4,warmth:2,solitude:5,order:2}, colors:['#321f25','#a64d3d','#d5c1aa'], summary:'你熟悉欲望与沉默之间的距离。真正重要的部分不一定被说出，它可能藏在重复、空白和迟来的凝视里。', inner:'你对缺席有高度感受力。记忆不是连续故事，而是几帧带着温度的画面，反复返回。', relation:'你渴望强烈、诚实的连接，却也需要保留不可进入的核心。你无法满足于只有功能、没有灵魂震动的关系。', gift:'捕捉空白中的张力；表达难以命名的欲望；敢于剥去叙事的装饰。', shadow:'把不可得浪漫化，可能让你忽略那些平实却真实可用的爱。', practice:'观察一段关系给你的实际滋养，而不只衡量它带来的强烈感。', reading:'《情人》' },
  { name:'普鲁斯特', en:'MARCEL PROUST', place:'法国', years:'1871—1922', archetype:'时间的显影师', mark:'P', vector:{imagination:4,sensitivity:5,rebellion:2,warmth:3,solitude:5,order:5}, colors:['#66506c','#b48954','#d8cfbb'], summary:'你的记忆不是仓库，而是一间暗房。某种味道、光线或声响，会突然显影出过去完整的情绪纹理。', inner:'你愿意长时间凝视经验，直到看见它如何被时间改变。你理解自我并非固定，而是由无数版本重叠而成。', relation:'你对关系中的细微变化极其敏锐，也容易在等待、猜测和回忆中消耗大量能量。', gift:'深度观察时间与记忆；把细微经验组织成复杂结构；耐心抵达感受深处。', shadow:'分析每一道波纹时，现实的船可能已经驶远。', practice:'为思考设置结束时间；时间一到，用一个现实动作回应当下。', reading:'《追忆似水年华》' },
  { name:'赫尔曼·黑塞', en:'HERMANN HESSE', place:'德国', years:'1877—1962', archetype:'内在道路的行旅者', mark:'H', vector:{imagination:5,sensitivity:4,rebellion:3,warmth:4,solitude:5,order:2}, colors:['#355b4b','#c38a3d','#d5c7ae'], summary:'你把人生理解为一条向内生长的道路。外界标准可以参考，但真正的方向必须经过自己的体验与醒悟。', inner:'你常在两种自我之间摆动：归属与自由、精神与感官、秩序与流浪。整合矛盾比消灭其中一方更重要。', relation:'你重视能共同成长的关系，同时需要保有独立旅程。过度黏连会让你失去内在方向。', gift:'持续自我更新；理解成长的阶段性；能把个人困惑转化为普遍经验。', shadow:'不断寻找“真正的自己”，可能让当前生活永远像一个过渡站。', practice:'今天的你不必等待终极答案；选一件愿意承诺半年的具体事。', reading:'《悉达多》' },
  { name:'川端康成', en:'YASUNARI KAWABATA', place:'日本', years:'1899—1972', archetype:'物哀的凝视者', mark:'雪', vector:{imagination:5,sensitivity:5,rebellion:2,warmth:3,solitude:5,order:4}, colors:['#dfe2dd','#5a7180','#9c4d45'], summary:'你对短暂、残缺与未完成之美特别敏锐。事物正因为会消逝，才在某个瞬间显得无比清晰。', inner:'你的感受依赖氛围和留白。比起解释，你更信任一个准确意象，让它独自承载复杂情绪。', relation:'你表达克制，却并不淡薄。你会记住相处中的气息与停顿，只是未必把它们直接说出来。', gift:'极致的审美感受力；在安静中辨认变化；用最少表达保留最大余韵。', shadow:'过度珍惜未完成的美，可能让你停在想象中，不愿面对关系的实际落地。', practice:'把一次含蓄的在意变成清楚的邀请或感谢。', reading:'《雪国》' },
  { name:'卡尔维诺', en:'ITALO CALVINO', place:'意大利', years:'1923—1985', archetype:'轻盈结构的建筑师', mark:'C', vector:{imagination:5,sensitivity:3,rebellion:3,warmth:4,solitude:3,order:4}, colors:['#28677a','#d76539','#ebd9a9'], summary:'你喜欢给沉重问题搭一座轻巧的结构。游戏、规则与想象不是逃避，而是让复杂世界重新变得可以探索。', inner:'你同时需要自由和形式。一个好框架会激发你的创造，而不是限制它；你擅长在限制中发现新玩法。', relation:'你喜欢有好奇心、能交换想法又不把彼此压得太重的人。共同创造比反复确认更能让你感到连接。', gift:'把复杂系统变得清晰有趣；兼具想象力与结构感；善于转换观察尺度。', shadow:'轻盈有时会跳过情绪重量，让他人误以为你没有真正进入问题。', practice:'在设计巧妙解法前，先陪伴问题原本的重量五分钟。', reading:'《看不见的城市》' },
];

const literaryPaths: Record<string, LiteraryPath> = {
  '鲁迅': { book:'《故乡》', figure:'归乡的“我”与闰土', road:'你正在学习的，是在看清人与人之间的隔膜之后，仍决定不把希望交还给麻木。你可能已经发现，指出问题并不难，难的是不让长期的失望把自己也变成冷眼旁观的人。', proof:'《故乡》没有把旧日友情写成圆满重逢。它让“我”亲眼看见身份、贫困与礼法怎样改变一个人，也让下一代仍保留靠近彼此的可能。书替你验证过：真正的清醒不是宣布无望，而是在旧路失效后，愿意让新路从脚下开始。', answer:'先辨认你真正反对的是什么，再把批判落到一个可以改变的具体关系或制度上。你的锋芒若能保护一个人、修正一条规则，就不再只是消耗自己的愤怒。', route:['把最刺痛你的问题写成一句不带情绪的事实','找到这件事里你能影响的最小环节','做一次具体修正，再决定是否继续投入'], readingNote:'读到“我”与闰土重逢时，不要只看悲凉；留意叙述者怎样从失望里重新谈到希望。' },
  '张爱玲': { book:'《倾城之恋》', figure:'白流苏', road:'你走的是一条在现实条件、亲密欲望与自我尊严之间寻找主动权的路。你不轻信漂亮话，也不愿把人生交给一场未经检验的浪漫。', proof:'白流苏并没有等到理想世界降临，她是在有限选择里观察、试探、承担代价。小说替你验证过：关系很少以纯粹的方式发生，但看见其中的利益与脆弱之后，人仍可以为自己争取一个较诚实的位置。', answer:'清醒应当帮助你选择，而不是让你提前否定一切。把“他是否完美”换成“这段关系是否持续尊重我、回应我、允许我做自己”。', route:['列出关系里已经发生的事实，而非猜测','说出一个不可退让的边界','观察对方连续三次行动，而不是一次表态'], readingNote:'重读白流苏每一次看似被动的选择，分辨她何时在求生，何时开始拥有自己的决定。' },
  '汪曾祺': { book:'《受戒》', figure:'明海与小英子', road:'你正在走一条把生活重新过得可感、可亲、可呼吸的路。你相信许多困境并不需要宏大宣言，而需要恢复人与食物、季节、劳动和真心之间的联系。', proof:'明海与小英子的世界没有靠激烈反叛获得自由，而是在真实日常里长出自然的感情。《受戒》替你验证过：生命力不一定轰鸣，它常常从不被羞耻的喜欢、具体的照料和对日常的信任中回来。', answer:'当生活变得抽象而疲惫，先恢复一种具体感受。你不必一次解决整个人生，先让今天有一顿认真吃的饭、一件诚实表达的偏好。', route:['为今天选一个真正喜欢的味道或去处','向一个人说出不修饰的关心','完成一件能立刻改善生活的小事'], readingNote:'读明海和小英子相处的段落，观察“自然”如何比自我解释更接近真实。' },
  '沈从文': { book:'《边城》', figure:'翠翠', road:'你走的是守护真心，却又必须学习把真心带进现实的一条路。你珍惜未被功利磨损的情感，但可能也习惯等待别人先理解。', proof:'翠翠的善良、等待与含蓄都很动人，可命运也因沉默、误解和错过不断偏移。《边城》替你验证过：纯粹值得守护，但善良不会自动替人完成表达，等待也不天然通往圆满。', answer:'不要把真心只留在内心的河岸。把暗示变成一次明确邀请，把体谅变成一个可以被对方理解的句子。', route:['确认你真正等待的是一个人还是一种想象','把需求说成对方能回答的问题','为等待设一个期限，期限后替自己选择'], readingNote:'留意翠翠没有说出口的部分；每一次沉默，都可以成为你今天练习表达的提示。' },
  '三毛': { book:'《撒哈拉的故事》', figure:'在沙漠生活的“我”', road:'你正在验证：自由究竟是离开熟悉环境，还是在任何环境里都能建立自己的生活。你需要远方，也需要一种不会被远方耗空的日常能力。', proof:'书里的沙漠并非只有浪漫，它还有缺水、修房、谋生、文化冲突与孤独。三毛替你验证过：远方之所以能成为生活，不靠冲动，而靠把陌生一点点做成可居住的日常。', answer:'自由不是没有结构，而是由你选择结构。给想去的地方一张预算表、一个期限和一项可持续技能，梦想才会从出口变成道路。', route:['把“想离开”改写成一个具体目的地或目标','列出金钱、能力与关系三项成本','先做一个七天可验证的小型出走'], readingNote:'读沙漠生活的琐碎段落，而不只读传奇；真正可复制的答案藏在她怎样安顿每天。' },
  '苏轼': { book:'《苏东坡传》', figure:'被贬黄州的苏轼', road:'你走的是把失去位置的人生，重新变成可以生活的人生。你不愿让一次失败定义全部叙事，但也需要避免用豁达过早覆盖伤口。', proof:'黄州时期的苏轼失去仕途中心，却从耕作、饮食、朋友与山水中重建生活。《苏东坡传》替你验证过：复原不是假装没事，而是把无法选择的处境，转化成仍可创造的日常。', answer:'先承认失去，再寻找处境里仍属于你的材料。身份可以被拿走，感受力、手艺、友谊和行动的主动权仍能重新组织。', route:['写下这次失去究竟带走了什么','列出仍可调用的三种资源','在七天内创造一个看得见的新作品或新习惯'], readingNote:'重点读黄州章节：观察他如何一边失意，一边做饭、交友、写作，而不是跳过痛苦直接旷达。' },
  '海明威': { book:'《老人与海》', figure:'圣地亚哥', road:'你正在走一条结果未必可控、行动必须由自己负责的路。你尊重完成、纪律与尊严，但可能把承受当成唯一语言。', proof:'圣地亚哥竭尽全力仍未完整带回大鱼。小说替你验证过：价值不只由战利品决定，也由一个人在不可控之中怎样使用自己的技术、判断和勇气决定。', answer:'把目标分成“我能控制的动作”和“我无法保证的结果”。今天只对前者负责，同时允许自己补给、求助与调整。', route:['写出下一步最小且可执行的动作','确定停止或求助的条件','完成后复盘方法，不用结果审判人格'], readingNote:'别只读他“硬撑”的部分，也留意男孩、食物和睡眠：坚韧从来需要补给。' },
  '卡夫卡': { book:'《变形记》', figure:'格里高尔·萨姆沙', road:'你正在面对“当我无法继续有用，我还值得被爱吗”的隐秘问题。你可能把责任背得太久，以至于忘了自己也应当作为一个人被看见。', proof:'格里高尔变形后，家庭关系里原本隐藏的交换迅速暴露。小说替你验证过：如果一个人的价值只建立在功能和牺牲上，那么再努力也无法换来真正安全的归属。', answer:'不要用更高效的自我消耗，修补一个只在你有用时才接纳你的系统。先恢复边界，再重新谈责任。', route:['列出哪些责任本应由他人共同承担','暂停一项长期默认由你兜底的任务','向可信任的人提出一次具体求助'], readingNote:'把它当作一份关系结构报告来读：谁在关心格里高尔，谁只在关心他还能提供什么。' },
  '伍尔夫': { book:'《达洛维夫人》', figure:'克拉丽莎·达洛维', road:'你走的是在众多角色和他人目光之间，保住自己内部房间的一条路。你能感知所有人的气氛，却容易把自己的声音放到最后。', proof:'克拉丽莎穿行于聚会、记忆和当下，外在社会角色与内部生命始终并行。小说替你验证过：一个人可以完成社会性的生活，同时仍需要守住不被角色吞没的精神空间。', answer:'你不必等所有人都满意，才允许自己安静。先划出不被打扰的时间，再从那个空间里决定哪些关系和责任真正属于你。', route:['每天保留二十分钟无输入的独处','记录今天最强烈但未表达的感受','取消一项只为维持他人印象的安排'], readingNote:'跟随克拉丽莎意识跳转的节奏，分辨哪些念头来自她自己，哪些来自社会对她的期待。' },
  '简·奥斯汀': { book:'《傲慢与偏见》', figure:'伊丽莎白·班纳特', road:'你正在学习怎样在保持判断力的同时，允许事实修正自己。你不愿被表象迷惑，却也可能过早相信自己的第一版结论。', proof:'伊丽莎白的成长不是放弃自尊，而是承认聪明人同样会误判。小说替你验证过：好的选择来自可修正的判断，而不是永远正确的判断。', answer:'继续保留标准，但把标准用于观察持续行为。给事实第二次出现的机会，也给自己改变看法的自由。', route:['写下你对这件事的第一判断及其证据','主动寻找一个可能推翻它的新事实','在行动一致三次后再做最终决定'], readingNote:'重点看伊丽莎白读信前后的变化：成熟不是自我否定，而是扩大证据。' },
  '艾米莉·狄金森': { book:'《狄金森诗选》', figure:'白房间里的诗歌叙述者', road:'你正在证明，安静而狭小的生活也可以拥有辽阔内部世界。但你同时需要判断：独处是在滋养你，还是在替你回避被看见。', proof:'狄金森以极有限的外部空间，写出死亡、永恒、自然和爱的巨大尺度。她的诗替你验证过：价值不依赖热闹见证；但作品真正抵达世界，仍需要被交付出去。', answer:'保留你的白房间，同时为它开一扇门。选择少数可信任的人，让内部世界得到真实回应，而非无限延期。', route:['完成一个不再继续修改的小作品','选一位安全的人发送出去','只询问“哪一处真正抵达了你”'], readingNote:'一次只读一首，并记录它在你身上引起的具体反应；不要急着把神秘全部解释掉。' },
  '加缪': { book:'《西西弗神话》', figure:'推石上山的西西弗', road:'你走的是在没有终极保证的世界里，仍决定如何生活的一条路。你可能等不到一个足够宏大的理由，但今天仍需要被认真度过。', proof:'西西弗的处境没有被神奇解决，改变的是他与命运的关系。作品替你验证过：当结果循环、意义缺席时，对行动的清醒承担本身就能夺回主动。', answer:'别等确定的人生意义批准你开始。选择一个你愿意承担的原则，用今天的动作让它成立。', route:['停止追问“它最终有什么用”十分钟','选一件与你原则一致的小事完成','用身体活动结束一轮过度思考'], readingNote:'把“荒诞”读成行动起点，而不是悲观结论；留意作者怎样从无答案走向反抗。' },
  '博尔赫斯': { book:'《虚构集·记忆大师富内斯》', figure:'记住一切的富内斯', road:'你正在处理信息、可能性与真实行动之间的距离。你擅长看见复杂结构，却可能因为所有细节都重要而无法迈步。', proof:'富内斯拥有近乎无限的记忆，却难以抽象、概括和真正思考。故事替你验证过：完整并不等于智慧；遗忘、选择与边界，反而是形成判断的必要条件。', answer:'你不需要一张包含全部道路的地图，只需要一个足以支持下一步的模型。允许遗漏，决策才会发生。', route:['删去当前问题中不会改变决定的信息','只保留三个判断标准','在四十八小时内做一次可逆选择'], readingNote:'读完后问自己：我是在理解问题，还是在用收集更多信息推迟选择？' },
  '马尔克斯': { book:'《百年孤独》', figure:'奥雷里亚诺家族', road:'你正在走出一种反复发生却很难被命名的家族或关系循环。你感受得到历史的重量，也有能力为它写出新的版本。', proof:'布恩迪亚家族不断重演相似的欲望、孤独与误解，直到记忆终于被读懂。小说替你验证过：未被说出的历史会以不同名字返回；命名循环，是停止重复的第一步。', answer:'把“这次怎么又这样”改成一张可见的模式图。区分哪些是你继承的反应，哪些是你今天愿意重新选择的动作。', route:['写下这类事件最近三次如何开始','圈出每次都出现的触发点','下一次只改变循环中的一个固定动作'], readingNote:'不要试图记住所有名字；追踪重复的性格与命运，你会更接近这本书给现实的答案。' },
  '托尔斯泰': { book:'《安娜·卡列尼娜》', figure:'列文', road:'你正在寻找一种让信念、工作、关系与日常彼此一致的生活。你不满足于表面成功，却容易把意义变成一场永远不及格的考试。', proof:'列文长期用思想追问人生，最终却在劳动、家庭与普通善意中触到意义。小说替你验证过：答案未必以理论的形式出现，它常在你如何度过一天、如何对待一个人时成立。', answer:'把价值观从判断工具改成生活动作。少纠正一个人，多完成一件与你相信的原则一致的事。', route:['选出此刻最重要的一条原则','把它翻译成今天十五分钟的行动','晚上检查行动，不给整个人格打分'], readingNote:'在宏大爱情悲剧之外跟随列文的劳动与困惑；他的慢答案更接近可实践的部分。' },
  '陀思妥耶夫斯基': { book:'《罪与罚》', figure:'拉斯柯尔尼科夫', road:'你正在穿过强烈思想、羞耻与自我审判构成的深井。你可能相信只有把问题推到极端，才能证明自己真正活过。', proof:'拉斯柯尔尼科夫试图用一套抽象理论越过普通人的道德，却被孤立与内在分裂持续追上。小说替你验证过：痛苦不会自动产生真理，脱离关系的聪明也无法替人完成救赎。', answer:'停止把自己关进内部法庭。先向一个真实的人陈述事实、承担责任，再让改变发生在重复的小行动里。', route:['把自我指控改写成可核实的事实','向可信任的人说出你一直隐藏的部分','做一项修复行动，而不是继续惩罚自己'], readingNote:'留意索尼娅如何提供连接而非辩论；真正让人物移动的，不是更完美的理论。' },
  '莎士比亚': { book:'《哈姆雷特》', figure:'哈姆雷特', road:'你正在面对“我必须全部想明白，才有资格行动吗”的问题。你能同时看见许多立场，因此也更容易被可能性拖住。', proof:'哈姆雷特的洞察极其深刻，但一次次推演并没有让代价消失。戏剧替你验证过：理解复杂性很重要，可现实不会等思考自然完成；延迟本身也会成为一种选择。', answer:'不追求毫无疑问的决定，追求价值一致且可修正的下一步。你可以一边行动，一边继续理解。', route:['确定这件事最不能背叛的一个价值','选择一个后果可控的试探动作','给思考设截止时间，到点后执行'], readingNote:'每次哈姆雷特延迟时，记录现实增加了什么代价；这会照见你的行动窗口。' },
  '王尔德': { book:'《道林·格雷的画像》', figure:'道林·格雷', road:'你正在分辨：创造风格是在表达自己，还是在保护一个不敢被看见的自己。审美和机智能给你自由，也可能变成不必承担代价的面具。', proof:'道林让画像承担真实生活留下的痕迹，自己维持完美表面。小说替你验证过：把代价藏起来不会使代价消失；只经营形象，最终会失去与真实自我的联系。', answer:'保留风格，但让一个决定经得起无人观看时的检验。真正的自由包含对后果的承担。', route:['找出一件只为维持形象而做的事','向一个人用朴素语言承认真实需要','完成一次没有观众也愿意做的选择'], readingNote:'把画像看成“未被承认的后果”；每次它变化，都问自己现实里有什么也正被你藏起来。' },
  '泰戈尔': { book:'《飞鸟集》', figure:'在世界中行走的诗歌叙述者', road:'你正在学习如何在保持开放与温柔的同时，不失去现实边界。你相信爱能让人更自由，但爱也需要具体形式才能停留。', proof:'《飞鸟集》反复把辽阔精神经验落到风、树、道路和相遇这些微小事物上。它替你验证过：真正的超越不是离开现实，而是在有限行动里恢复与世界的连接。', answer:'把抽象的善意变成可被接收的动作，也把不接受的部分清楚说出。温柔与边界可以同时存在。', route:['把“我希望你好”翻译成一次具体帮助','确认对方是否真的需要这份帮助','对一件消耗你的事说出清楚的“不”'], readingNote:'每读几则就停下来，选一句转化成当天的行动，而不是只收藏美感。' },
  '玛格丽特·杜拉斯': { book:'《情人》', figure:'多年后回望往事的“我”', road:'你正在辨认强烈、缺席与真正滋养之间的差别。你熟悉那些无法彻底拥有的关系，也容易把未完成当成它更深刻的证明。', proof:'《情人》通过多年后的回望，一再重写同一段欲望与创伤。它替你验证过：强烈经验可以塑造一个人，但强烈本身并不证明一段关系适合继续。', answer:'尊重这段经验对你的意义，同时用现实指标判断它是否值得留下。记忆可以被保存，生活不必继续被它占据。', route:['写下这段关系实际给你的三样东西','再写下它持续拿走的三样东西','依据现在的事实决定靠近、重谈或离开'], readingNote:'留意成年叙述者如何重写少女时期；记忆是真实经验，却不一定是行动指令。' },
  '普鲁斯特': { book:'《追忆似水年华》', figure:'寻找失去时间的马塞尔', road:'你正在把过去从反复回想，转化成能够理解今天的材料。你拥有深度感受时间的能力，却也可能留在分析里错过当下。', proof:'马塞尔最终发现，失去的时间无法原样返回，却能通过感受、理解与创作获得新的形式。作品替你验证过：回忆的出口不是复原过去，而是把过去变成今天可以创造的东西。', answer:'给回忆一个容器和完成方式。写成一页、做成一个作品、说出一次告别，然后把注意力交还给现在。', route:['选一个反复返回的记忆并限时写十分钟','提炼它今天仍影响你的一个信念','做一个与新理解一致的现实动作'], readingNote:'不必急着从头读完；从“玛德莱娜”相关章节开始，观察感官如何把记忆变成创造。' },
  '赫尔曼·黑塞': { book:'《悉达多》', figure:'悉达多', road:'你正在寻找不能从别人那里直接领取的人生答案。你需要亲自经验，但也可能因不断寻找而把每个当下都当作临时站。', proof:'悉达多先后走过苦修、欲望、财富、失落与河流，没有一种单独道路成为终点。小说替你验证过：成长不是找到唯一正确身份，而是停止排斥已经经历过的自己，并让矛盾汇入同一条生命。', answer:'不再等“完全确定的我”出现。选一件愿意承担半年的具体生活，让答案在持续实践中长出来。', route:['承认过去经历已经教会你的三件事','选一个半年内不再更换的承诺','每月复盘调整方法，但不重启身份'], readingNote:'留意河流如何把不同时间同时容纳；它给出的不是路线图，而是整合的方法。' },
  '川端康成': { book:'《雪国》', figure:'岛村与驹子', road:'你正在学习把对美、遗憾和距离的感受，转化成对真实关系的承担。你能看见瞬间的余韵，却可能因此更愿意停在未完成里。', proof:'岛村凝视并欣赏驹子的生命，却始终保留距离；美感没有自动成为责任。《雪国》替你验证过：被深刻感动并不等于真正进入一个人的现实，旁观的温柔仍可能留下伤害。', answer:'让感受落地。喜欢就给出明确回应，在意就承担时间和行动；若不能投入，也要诚实说明边界。', route:['把一个含蓄信号改成清楚句子','提出一次有时间地点的真实邀请','根据回应决定继续投入或体面退场'], readingNote:'一边读风景，一边看谁在承担生活的重量；美与责任之间的距离就是这本书的现实答案。' },
  '卡尔维诺': { book:'《看不见的城市》', figure:'马可·波罗', road:'你正在给一个沉重复杂的问题寻找轻盈结构。你有能力构造许多可能世界，但最终仍要从地图走回生活。', proof:'马可·波罗用一座座城市描述欲望、记忆、死亡和关系，每个模型都照见现实的一面。作品替你验证过：换一种结构能让困境重新可见，但模型的价值在于帮助选择，而不是替代进入。', answer:'先设计一个足够轻的实验，让想象接受现实反馈。好的框架不是完美解释世界，而是让你愿意开始。', route:['把问题画成三个可调整的变量','设计一个七天内能完成的小实验','依据真实反馈保留、修改或放弃框架'], readingNote:'每次只读一两座城市，并写下它对应你现实里的什么；让寓言成为工具，不只是收藏。' },
};

const scale = [1, 2, 3, 4, 5];

function calculateScores(answers: number[]): Scores {
  const totals: Record<Trait, number[]> = { imagination:[], sensitivity:[], rebellion:[], warmth:[], solitude:[], order:[] };
  questions.forEach((question, index) => totals[question.trait].push(answers[index] || 3));
  return Object.fromEntries(Object.entries(totals).map(([trait, values]) => [trait, values.reduce((a,b)=>a+b,0) / values.length])) as Scores;
}

function distance(scores: Scores, author: Author) {
  return (Object.keys(scores) as Trait[]).reduce((sum, trait) => sum + Math.pow(scores[trait] - author.vector[trait], 2), 0);
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [copied, setCopied] = useState(false);

  const scores = useMemo(() => calculateScores(answers), [answers]);
  const matches = useMemo(() => [...authors].sort((a,b) => distance(scores,a) - distance(scores,b)).slice(0,3), [scores]);
  const result = matches[0];
  const path = literaryPaths[result.name];
  const resonance = (author: Author) => Math.max(72, Math.round(100 - distance(scores,author) / 96 * 100));
  const answered = answers.filter(Boolean).length;

  function choose(value: number) {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
    window.setTimeout(() => {
      if (current < questions.length - 1) setCurrent(current + 1);
      else setStage('result');
    }, 180);
  }

  function restart() {
    setAnswers(Array(questions.length).fill(0));
    setCurrent(0);
    setCopied(false);
    setStage('intro');
  }

  async function shareResult() {
    const text = `我的文学人格底色是「${result.name}型 · ${result.archetype}」，共鸣度 ${resonance(result)}%。${path.book}里，${path.figure}已经替我走过一段相似的路。`;
    if (navigator.share) await navigator.share({ title:'文学人格底色', text, url:window.location.href });
    else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); setCopied(true); }
  }

  return (
    <main className={`site ${stage}`}>
      <header className="masthead">
        <button className="wordmark" onClick={restart} aria-label="返回测试首页"><span>底</span><b>人格底色</b></button>
        <div className="edition"><span>LITERARY TEMPERAMENT ARCHIVE</span><span>第二版 · 24 位文学原型</span></div>
      </header>

      {stage === 'intro' && (
        <section className="landing" aria-labelledby="main-title">
          <div className="landing-copy">
            <div className="issue-line"><span>NO. 024</span><i /><span>一份关于你内在叙事的私人档案</span></div>
            <h1 id="main-title"><small>如果你的灵魂</small><em>是一本文学作品</em><strong>谁会写下它？</strong></h1>
            <p className="intro-text">18 个具体的生活片段，六种精神刻度。我们将从 24 位中外文学家的作品气质中，找到与你此刻最接近的那一种人格底色。</p>
            <p className="promise-note"><span>本次阅读的答案</span><strong>你走的这条路，书里已经有人替你走过。</strong>不是一句空泛安慰，而是一段经过人物命运验证的经验。</p>
            <div className="intro-actions"><button className="ink-button" onClick={() => setStage('quiz')}>打开测试档案 <span>↗</span></button><p>约 5 分钟<br />无需登录</p></div>
          </div>

          <div className="archive-art" aria-hidden="true">
            <div className="poster poster-back"><span>THE<br/>INNER<br/>TEXT</span></div>
            <div className="poster poster-front">
              <span className="poster-no">ARCHIVE / 024</span>
              <div className="face-type">文</div>
              <p>不是成为某位作家<br/>而是照见相似的灵魂纹理</p>
              <b>PERSONA<br/>IN PRINT</b>
            </div>
            <div className="red-thread" /><div className="stamp">私人<br/>阅读</div>
          </div>

          <div className="author-marquee"><span>鲁迅</span><span>张爱玲</span><span>伍尔夫</span><span>卡夫卡</span><span>三毛</span><span>博尔赫斯</span><span>奥斯汀</span><span>马尔克斯</span><span>＋16</span></div>
        </section>
      )}

      {stage === 'quiz' && (
        <section className="quiz-shell" aria-live="polite">
          <aside className="quiz-aside">
            <span className="vertical-label">PERSONAL ARCHIVE</span>
            <div className="folio"><small>问题</small><strong>{String(current + 1).padStart(2,'0')}</strong><span>/ {questions.length}</span></div>
            <div className="mini-index">{Object.entries(traits).map(([key,trait]) => <span key={key} className={questions[current].trait === key ? 'on' : ''}>{trait.name}</span>)}</div>
          </aside>
          <div className="question-panel" key={current}>
            <div className="progress"><span style={{width:`${((current+1)/questions.length)*100}%`}} /></div>
            <p className="scene">{questions[current].scene}</p>
            <h2>{questions[current].text}</h2>
            <p className="instruction">哪一端更接近你当时最自然的反应？</p>
            <div className="pole-labels"><span>{questions[current].low}</span><i/><span>{questions[current].high}</span></div>
            <div className="literary-scale">
              {scale.map(value => <button key={value} className={answers[current] === value ? 'selected' : ''} onClick={() => choose(value)} aria-label={`选择程度 ${value}`}><span>{value}</span><small>{value===1?'更靠左':value===3?'介于两者':value===5?'更靠右':''}</small></button>)}
            </div>
            <div className="question-foot"><button disabled={current===0} onClick={()=>setCurrent(current-1)}>← 回看上一页</button><span>已留下 {answered} / {questions.length} 个回答</span></div>
          </div>
        </section>
      )}

      {stage === 'result' && (
        <section className="result-shell" style={{'--accent':result.colors[1],'--deep':result.colors[0],'--paper2':result.colors[2]} as React.CSSProperties}>
          <div className="result-heading">
            <p>PERSONAL LITERARY PORTRAIT · 01</p>
            <span>基于作品气质的文学隐喻，并非对作家本人或你的心理诊断</span>
          </div>
          <div className="portrait-grid">
            <div className="author-plate">
              <div className="plate-top"><span>{result.place}</span><span>{result.years}</span></div>
              <div className="author-mark">{result.mark}</div>
              <p>{result.en}</p>
              <div className="plate-colors">{result.colors.map(color=><i key={color} style={{background:color}} />)}</div>
            </div>
            <div className="result-title">
              <p>你的文学人格底色接近</p>
              <h1>{result.name}<small>型</small></h1>
              <h2>「{result.archetype}」</h2>
              <div className="resonance"><span>共鸣度</span><strong>{resonance(result)}%</strong><i><b style={{width:`${resonance(result)}%`}}/></i></div>
              <p className="result-lead">{result.summary}</p>
            </div>
          </div>

          <section className="literary-proof" aria-labelledby="proof-title">
            <header className="proof-header">
              <div><p>THE BOOK HAS BEEN THERE · 书中来信</p><h2 id="proof-title">你走的这条路，<br/><em>有人已经替你走过。</em></h2></div>
              <div className="book-seal"><span>建议阅读</span><strong>{path.book}</strong><small>{path.figure}</small></div>
            </header>
            <div className="proof-grid">
              <article className="proof-road"><span>01 / 你此刻的路</span><h3>你真正面对的，并不只是眼前这件事</h3><p>{path.road}</p></article>
              <article className="proof-story"><span>02 / 书中验证</span><h3>{path.figure}<small>已经在 {path.book} 里走到这里</small></h3><p>{path.proof}</p></article>
              <article className="proof-answer"><span>03 / 带回现实的答案</span><h3>这本书没有替你决定，<br/>但它替你排除了一条弯路</h3><p>{path.answer}</p></article>
            </div>
            <div className="route-card">
              <div className="route-intro"><span>YOUR NEXT THREE PAGES</span><h3>接下来三步，<br/>把文学变成行动。</h3></div>
              <ol>{path.route.map((step,index)=><li key={step}><span>0{index+1}</span><p>{step}</p></li>)}</ol>
            </div>
            <aside className="reading-margin"><span>阅读提示</span><p>{path.readingNote}</p></aside>
          </section>

          <div className="essay-grid">
            <article className="essay essay-wide"><span>01 / 内在叙事</span><h3>你如何理解自己</h3><p>{result.inner}</p></article>
            <article className="essay"><span>02 / 关系语言</span><h3>你如何靠近他人</h3><p>{result.relation}</p></article>
            <article className="essay dark"><span>03 / 天赋</span><h3>你带来的独特价值</h3><p>{result.gift}</p></article>
            <article className="essay accent"><span>04 / 阴影页</span><h3>需要留意的盲点</h3><p>{result.shadow}</p></article>
            <article className="essay"><span>05 / 今日练习</span><h3>给你的一个小行动</h3><p>{result.practice}</p></article>
          </div>

          <div className="spectrum-section">
            <div><p className="section-kicker">SIX INNER TEXTURES</p><h2>你的六种精神刻度</h2></div>
            <div className="spectrum-list">{(Object.keys(traits) as Trait[]).map(trait=><div className="spectrum-row" key={trait}><span>{traits[trait].name}<small>{traits[trait].hint}</small></span><i><b style={{width:`${scores[trait]*20}%`}}/></i><strong>{Math.round(scores[trait]*20)}</strong></div>)}</div>
          </div>

          <div className="echoes">
            <div className="echo-copy"><p>你的另外两种回声</p><h2>人格从来不是<br/>一个单独的名字。</h2><span>先从 {path.book} 开始。你不是为了寻找标准答案，而是去看一个人怎样承担相似选择的后果。</span></div>
            <div className="echo-cards">{matches.slice(1).map((author,index)=><article key={author.name}><span>0{index+2}</span><div><small>{author.en}</small><h3>{author.name}</h3><p>{author.archetype}</p></div><strong>{resonance(author)}%</strong></article>)}</div>
          </div>

          <div className="result-actions"><button className="ink-button" onClick={shareResult}>{copied?'结果已复制':'分享这页人格档案'} <span>↗</span></button><button className="restart" onClick={restart}>重新翻阅自己</button></div>
          <p className="legal">本测试用于自我探索与文化娱乐。文学家原型来自其作品呈现的气质联想，不代表对作家本人性格的事实判断。</p>
        </section>
      )}
    </main>
  );
}
