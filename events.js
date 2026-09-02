(function (global) {
  // ===== 随机事件池：高考与志愿 / 本科阶段 =====
  const randomEvents = [
    {
      id: 're_gk_score_night',
      stage: 'gaokao',
      title: '🎲 查分服务器崩了',
      text: '全省考生同时刷新，页面转圈转了四十分钟。家庭群里已经开始猜分。',
      rarity: 'common',
      weight: 10,
      returnTo: 'gaokao_choice',
      options: [
        { text: '关掉手机，出门走一圈再回来看', label: '休息', effects: { stress: -8, health: 6 } },
        { text: '守着刷新，第一时间知道结果', effects: { stress: 8, health: -4, skill: 2 } },
        { text: '打电话找班主任帮忙问', label: '团队协作', effects: { network: 6, stress: -4, money: -2 } }
      ]
    },
    {
      id: 're_gk_relative_advice',
      stage: 'gaokao',
      title: '🎲 七大姑八大姨的志愿指导',
      text: '“学医好啊，铁饭碗！”“别学医，规培到三十岁！”两派亲戚在客厅打起了嘴仗。',
      rarity: 'common',
      weight: 10,
      returnTo: 'gaokao_choice',
      options: [
        { text: '礼貌听完，自己去查招生数据', label: '均衡', effects: { skill: 6, stress: -3, ethics: 3 } },
        { text: '被说动，开始怀疑自己的选择', effects: { stress: 10, ethics: -3 } },
        { text: '当场立誓“我就要学医”', effects: { ethics: 8, stress: 4, network: 3 } }
      ]
    },
    {
      id: 're_gk_volunteer_app',
      stage: 'gaokao',
      title: '🎲 志愿填报 App 的“内部数据”',
      text: '一款收费 1998 元的志愿填报服务保证“不滑档”，客服话术滴水不漏。',
      rarity: 'common',
      weight: 9,
      returnTo: 'major_confirm',
      options: [
        { text: '不花这个钱，自己对着往年分数线算', label: '稳妥', effects: { skill: 8, stress: 5 } },
        { text: '掏钱买个安心', effects: { money: -18, stress: -6, skill: 2 } },
        { text: '找已经上大学的学长免费咨询', label: '团队协作', effects: { network: 8, skill: 5, stress: -4 } }
      ]
    },
    {
      id: 're_gk_classmate_compare',
      stage: 'gaokao',
      title: '🎲 同学之间的分数试探',
      text: '“你考得怎么样？”这句话现在是一种社交酷刑。',
      rarity: 'common',
      weight: 8,
      returnTo: 'gaokao_choice',
      options: [
        { text: '大方交流，顺便交换志愿情报', label: '团队协作', effects: { network: 8, stress: -3, skill: 3 } },
        { text: '含糊其辞，谁也不告诉', effects: { stress: 5, network: -4 } }
      ]
    },
    {
      id: 're_gk_recruiter_call',
      stage: 'gaokao',
      title: '🎲 招生老师的深夜来电',
      text: '一所外省院校承诺：报我们临床，专业随便挑，还有新生奖学金。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'major_confirm',
      options: [
        { text: '认真核实院校实力和附属医院', label: '稳妥', effects: { skill: 6, network: 5, stress: 2 } },
        { text: '被奖学金打动，当场答应', label: '激进', effects: { money: 12, stress: 6, health: -3 } },
        { text: '礼貌拒绝，坚持原计划', effects: { ethics: 5, stress: -2 } }
      ]
    },
    {
      id: 're_gk_documentary',
      stage: 'gaokao',
      title: '🎲 深夜刷到的医疗纪录片',
      text: '镜头里医生连轴转 36 小时后蹲在楼梯间吃盒饭，也拍到了他被家属鞠躬的那一刻。',
      rarity: 'common',
      weight: 8,
      returnTo: 'gaokao_choice',
      options: [
        { text: '看完热血沸腾，更坚定了', effects: { ethics: 10, stress: 3, health: -2 } },
        { text: '看完后背发凉，认真重新评估', label: '均衡', effects: { skill: 5, stress: 5, ethics: -2 } }
      ]
    },
    {
      id: 're_gk_summer_job',
      stage: 'gaokao',
      title: '🎲 毕业暑假的第一份工',
      text: '奶茶店招暑期工，时薪不高但能赚下学期的生活费。',
      rarity: 'common',
      weight: 8,
      returnTo: 'major_confirm',
      options: [
        { text: '干满整个暑假，攒一笔启动资金', effects: { money: 14, health: -6, stress: 5, network: 3 } },
        { text: '只做半个月，剩下时间预习医学英语', label: '长期主义', effects: { money: 6, skill: 8, stress: 2 } },
        { text: '彻底躺平，人生难得的空白期', label: '休息', effects: { health: 10, stress: -12, money: -3 } }
      ]
    },
    {
      id: 're_gk_health_check',
      stage: 'gaokao',
      title: '🎲 入学体检的小插曲',
      text: '色觉检查那一栏，你盯着数字看了三秒钟，护士的笔停在半空。',
      rarity: 'uncommon',
      weight: 5,
      returnTo: 'major_confirm',
      options: [
        { text: '如实说明并申请复查', label: '稳妥', effects: { ethics: 8, stress: 5, legalRisk: -4 } },
        { text: '硬着头皮蒙一个数字', effects: { stress: 8, ethics: -6, legalRisk: 5 } }
      ]
    },
    {
      id: 're_gk_family_budget',
      stage: 'gaokao',
      title: '🎲 学费账单摆上餐桌',
      text: '父母把存折推到你面前：“五年，或者八年，我们都供。”你注意到数字后面的位数。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'major_confirm',
      options: [
        { text: '申请助学贷款，减轻家里负担', label: '稳妥', effects: { money: 10, ethics: 6, stress: 4 } },
        { text: '承诺自己打工赚生活费', label: '长期主义', effects: { money: 5, health: -4, ethics: 8, stress: 5 } },
        { text: '接受家里全额支持，专心读书', effects: { money: 12, skill: 5, stress: -5, ethics: -2 } }
      ]
    },
    {
      id: 're_gk_dorm_shopping',
      stage: 'gaokao',
      title: '🎲 开学装备采购清单',
      text: '学姐给的清单上写着：白大褂两件、听诊器、解剖图谱，以及“很多很多的笔”。',
      rarity: 'common',
      weight: 7,
      returnTo: 'major_confirm',
      options: [
        { text: '一步到位买齐好装备', effects: { money: -14, skill: 6, stress: -3 } },
        { text: '只买必需品，其余用二手', label: '稳妥', effects: { money: -4, network: 5, skill: 3 } }
      ]
    },

    {
      id: 're_dorm_conflict',
      stage: 'undergrad',
      title: '🎲 宿舍熄灯之争',
      text: '室友的机械键盘和你的早八水火不容，宿舍气氛降到冰点。',
      rarity: 'common',
      weight: 10,
      returnTo: 'anatomy_lab',
      options: [
        { text: '开个宿舍会，把作息规则谈清楚', label: '团队协作', effects: { network: 10, stress: -6, ethics: 4 } },
        { text: '忍着，戴上降噪耳塞硬扛', effects: { stress: 10, health: -6, skill: 4 } },
        { text: '申请调宿舍，换个环境', effects: { stress: -8, health: 6, network: -6 } }
      ]
    },
    {
      id: 're_scholarship_race',
      stage: 'undergrad',
      title: '🎲 奖学金差 0.2 分',
      text: '综测排名公布，你和一等奖学金之间只隔着一个小数点。',
      rarity: 'common',
      weight: 9,
      returnTo: 'biochem_week',
      options: [
        { text: '复盘加分项，明年卷回来', label: '长期主义', effects: { skill: 10, stress: 8 } },
        { text: '找辅导员核对算分细节', label: '团队协作', effects: { network: 8, money: 6, stress: 3 } },
        { text: '看开点，去吃顿好的', label: '休息', effects: { stress: -12, health: 8, money: -4 } }
      ]
    },
    {
      id: 're_mentor_bias',
      stage: 'undergrad',
      title: '🎲 见习带教的偏心',
      text: '带教明显更喜欢会来事的同学，你连摸一次听诊器的机会都被挤掉了。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'clerkship_intro',
      options: [
        { text: '主动争取，多问多练刷存在感', label: '激进', effects: { skill: 12, network: 6, stress: 8 } },
        { text: '默默把基本功练到扎实', label: '长期主义', effects: { skill: 8, ethics: 6, stress: 3 } },
        { text: '找同组同学互相创造练习机会', label: '团队协作', effects: { skill: 6, network: 8, stress: -3 } }
      ]
    },
    {
      id: 're_part_time',
      stage: 'undergrad',
      title: '🎲 家教兼职机会',
      text: '一份高中生物家教找上门，时薪不错，但每周要占掉两个晚上。',
      rarity: 'common',
      weight: 9,
      returnTo: 'freshman_life',
      options: [
        { text: '接下来，缓解生活费压力', effects: { money: 16, stress: 6, health: -5 } },
        { text: '只接周末，平衡时间', label: '均衡', effects: { money: 8, network: 4, stress: 2 } },
        { text: '拒绝，专注学业', label: '长期主义', effects: { skill: 8, stress: -3, money: -2 } }
      ]
    },
    {
      id: 're_club_viral',
      stage: 'undergrad',
      title: '🎲 社团义诊上了校媒热搜',
      text: '你参与策划的社区义诊被转发出圈，评论区一片“这才是医学生”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'campus_meme_night',
      options: [
        { text: '趁热度把公益项目做成常态', label: '长期主义', effects: { network: 14, ethics: 8, stress: 6, health: -3 } },
        { text: '低调收尾，回去上课', effects: { skill: 6, stress: -4 } },
        { text: '拉上同学组建正式志愿队', label: '团队协作', effects: { network: 10, ethics: 6, skill: 4, stress: 3 } }
      ]
    },
    {
      id: 're_library_encounter',
      stage: 'undergrad',
      title: '🎲 图书馆的偶遇',
      text: '你和一个总坐老位置的同学，因为抢同一本《病理学》聊了起来。',
      rarity: 'common',
      weight: 8,
      returnTo: 'clerkship_intro',
      options: [
        { text: '组个学习搭子，互相抽背', label: '团队协作', effects: { skill: 10, network: 6, stress: -5 } },
        { text: '礼貌点头，各刷各的', effects: { skill: 5, stress: 2 } }
      ]
    },
    {
      id: 're_ug_cadaver_ceremony',
      stage: 'undergrad',
      title: '🎲 大体老师致敬仪式',
      text: '课程结束前，全班鞠躬默哀。有人念出了捐献者生前留下的一句话。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'anatomy_lab',
      options: [
        { text: '认真写下这一刻的感受', effects: { ethics: 12, stress: -5, skill: 3 } },
        { text: '主动参与遗体捐献科普志愿', label: '长期主义', effects: { ethics: 10, network: 8, stress: 3 } }
      ]
    },
    {
      id: 're_ug_anatomy_nightmare',
      stage: 'undergrad',
      title: '🎲 连续三晚的解剖梦',
      text: '你梦见自己在标本室里背臂丛神经，醒来发现真的背错了两根。',
      rarity: 'common',
      weight: 8,
      returnTo: 'anatomy_lab',
      options: [
        { text: '把梦当复习，凌晨爬起来补背', effects: { skill: 10, health: -6, stress: 6 } },
        { text: '调整作息，睡前不再看图谱', label: '休息', effects: { health: 10, stress: -10, skill: 2 } }
      ]
    },
    {
      id: 're_ug_cet_exam',
      stage: 'undergrad',
      title: '🎲 四六级与专业课撞车',
      text: '英语考试和病理实验考在同一周，两边都不能挂。',
      rarity: 'common',
      weight: 9,
      returnTo: 'biochem_week',
      options: [
        { text: '做时间表，两边都稳住', label: '均衡', effects: { skill: 8, stress: 6, health: -3 } },
        { text: '先保专业课，英语明年再战', label: '稳妥', effects: { skill: 6, stress: -3, money: -3 } },
        { text: '通宵双线作战', label: '激进', effects: { skill: 12, health: -10, stress: 12 } }
      ]
    },
    {
      id: 're_ug_group_project',
      stage: 'undergrad',
      title: '🎲 小组作业的划水队友',
      text: '五个人的展示，四个人的名字，一个人的 PPT——那个人是你。',
      rarity: 'common',
      weight: 9,
      returnTo: 'biochem_week',
      options: [
        { text: '直接沟通，重新分工', label: '团队协作', effects: { network: 8, skill: 5, stress: 3 } },
        { text: '自己全干完，顺便练熟内容', effects: { skill: 10, stress: 8, health: -5, network: -3 } },
        { text: '向老师如实说明贡献比例', effects: { ethics: 8, network: -6, stress: 4 } }
      ]
    },
    {
      id: 're_ug_free_clinic',
      stage: 'undergrad',
      title: '🎲 周末社区义诊',
      text: '你被安排量血压。一位老人握着你的手说：“小大夫，你比我孙子还耐心。”',
      rarity: 'common',
      weight: 8,
      returnTo: 'clerkship_intro',
      options: [
        { text: '认真做完全程，还留下健康宣教手册', effects: { ethics: 10, network: 6, skill: 5, health: -3 } },
        { text: '走个流程就撤，下午还要复习', effects: { skill: 6, stress: 2, ethics: -3 } }
      ]
    },
    {
      id: 're_ug_blood_donation',
      stage: 'undergrad',
      title: '🎲 献血车开进校园',
      text: '“医学生带头献血”的横幅挂了出来，你的胳膊有点抖。',
      rarity: 'common',
      weight: 7,
      returnTo: 'freshman_life',
      options: [
        { text: '撸起袖子，献了 400 毫升', effects: { ethics: 10, health: -5, network: 5, money: 3 } },
        { text: '这周熬夜太多，改天再来', label: '稳妥', effects: { health: 5, ethics: -2, stress: -3 } }
      ]
    },
    {
      id: 're_ug_sports_test',
      stage: 'undergrad',
      title: '🎲 体测 1000 米',
      text: '常年久坐自习室的你，站在起跑线上产生了强烈的求生欲。',
      rarity: 'common',
      weight: 8,
      returnTo: 'freshman_life',
      options: [
        { text: '提前一个月开始跑步训练', label: '长期主义', effects: { health: 14, stress: -8, skill: 2 } },
        { text: '裸测，全靠意志力', effects: { health: -8, stress: 8, ethics: 2 } }
      ]
    },
    {
      id: 're_ug_lab_report_copy',
      stage: 'undergrad',
      title: '🎲 “实验报告借我抄一下”',
      text: '截止前两小时，室友发来消息，语气理直气壮。',
      rarity: 'common',
      weight: 8,
      returnTo: 'biochem_week',
      options: [
        { text: '拒绝，但坐下来给他讲一遍原理', label: '团队协作', effects: { ethics: 10, network: 5, skill: 5, stress: 4 } },
        { text: '直接发过去，图个人情', effects: { network: 6, ethics: -8, legalRisk: 4 } },
        { text: '发了并要求改写，结果两人一起被查重', effects: { network: 3, ethics: -5, stress: 8, legalRisk: 6 } }
      ]
    },
    {
      id: 're_ug_lab_invitation',
      stage: 'undergrad',
      title: '🎲 教授邀请你进实验室',
      text: '一位做基础研究的老师问你：“想不想提前接触课题？”',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'campus_meme_night',
      options: [
        { text: '答应，牺牲周末泡实验室', label: '长期主义', effects: { research: 14, network: 8, stress: 8, health: -5 } },
        { text: '先去旁听两周再决定', label: '均衡', effects: { research: 6, skill: 4, stress: 2 } },
        { text: '婉拒，本科先把临床基础打牢', label: '稳妥', effects: { skill: 10, stress: -3 } }
      ]
    },
    {
      id: 're_ug_relative_wechat',
      stage: 'undergrad',
      title: '🎲 亲戚的微信问诊',
      text: '“你学医的，帮我看看这个化验单？”后面跟着九张模糊的截图。',
      rarity: 'common',
      weight: 9,
      returnTo: 'clerkship_intro',
      options: [
        { text: '说明自己还没资格，建议去正规就诊', label: '稳妥', effects: { ethics: 10, legalRisk: -6, network: -3 } },
        { text: '硬着头皮给了个“大概应该没事”', effects: { network: 5, legalRisk: 10, ethics: -6, stress: 5 } },
        { text: '帮忙挂上号并陪同就诊', label: '团队协作', effects: { network: 10, ethics: 8, health: -4, money: -4 } }
      ]
    },
    {
      id: 're_ug_flu_down',
      stage: 'undergrad',
      title: '🎲 流感季，你倒下了',
      text: '烧到 39 度，室友把退烧药和粥放在你桌上就去上课了。',
      rarity: 'common',
      weight: 8,
      returnTo: 'biochem_week',
      options: [
        { text: '去校医院正经看病，请假休息', label: '休息', effects: { health: 12, stress: -8, money: -5, skill: -3 } },
        { text: '吃药硬撑着去上课', effects: { health: -12, stress: 10, skill: 5 } }
      ]
    },
    {
      id: 're_ug_canteen_price',
      stage: 'undergrad',
      title: '🎲 月末的饭卡余额',
      text: '最后一周，饭卡余额和你的意志力同时告急。',
      rarity: 'common',
      weight: 8,
      returnTo: 'freshman_life',
      options: [
        { text: '申请勤工助学岗位', label: '稳妥', effects: { money: 12, network: 5, stress: 3, health: -3 } },
        { text: '连吃一周素菜，硬省', effects: { money: 5, health: -8, stress: 5 } },
        { text: '和室友合伙团购做饭', label: '团队协作', effects: { money: 8, network: 8, health: 5, stress: -3 } }
      ]
    },
    {
      id: 're_ug_speech_contest',
      stage: 'undergrad',
      title: '🎲 医学人文演讲比赛',
      text: '主题是“为什么是医学”。你写了三版稿子，删掉了所有假大空的句子。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'campus_meme_night',
      options: [
        { text: '认真准备，上台讲自己的真实想法', effects: { network: 10, ethics: 8, skill: 4, stress: 5 } },
        { text: '临时套模板，混个参与奖', effects: { stress: -3, ethics: -3, network: 3 } }
      ]
    },
    {
      id: 're_ug_skill_contest',
      stage: 'undergrad',
      title: '🎲 临床技能大赛选拔',
      text: '心肺复苏、缝合、导尿，全部要在计时器下完成。你的手心全是汗。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'clerkship_intro',
      options: [
        { text: '进集训队，每天加练三小时', label: '激进', effects: { skill: 16, stress: 12, health: -8, network: 6 } },
        { text: '报名参与，按自己的节奏练', label: '均衡', effects: { skill: 8, stress: 4, network: 4 } },
        { text: '这次不报，先把课程学分保住', label: '稳妥', effects: { skill: 5, stress: -4 } }
      ]
    },
    {
      id: 're_ug_shadowing',
      stage: 'undergrad',
      title: '🎲 暑期跟诊',
      text: '你跟着一位门诊医生坐了一上午，他看了 47 个病人，喝了两口水。',
      rarity: 'common',
      weight: 8,
      returnTo: 'clerkship_intro',
      options: [
        { text: '认真记录每一个问诊逻辑', effects: { skill: 12, ethics: 5, stress: 4, health: -3 } },
        { text: '主动帮忙叫号、维持秩序', label: '团队协作', effects: { network: 10, ethics: 6, skill: 4 } },
        { text: '中途溜出去缓口气', label: '休息', effects: { health: 6, stress: -6, skill: -3 } }
      ]
    },
    {
      id: 're_ug_game_addiction',
      stage: 'undergrad',
      title: '🎲 开黑到凌晨三点',
      text: '“最后一把”说了六次。第二天生理课，你的意识在另一个服务器上。',
      rarity: 'common',
      weight: 8,
      returnTo: 'freshman_life',
      options: [
        { text: '删掉游戏，重建作息', label: '长期主义', effects: { health: 10, skill: 8, stress: -5, network: -4 } },
        { text: '定个时间上限，周末才玩', label: '均衡', effects: { health: 5, stress: -6, skill: 3 } },
        { text: '继续放纵一个学期', effects: { stress: -10, health: -10, skill: -8, network: 5 } }
      ]
    },
    {
      id: 're_ug_online_course',
      stage: 'undergrad',
      title: '🎲 二倍速录播',
      text: '你发现 2 倍速能省一半时间，但老师讲的临床小故事都被你跳过了。',
      rarity: 'common',
      weight: 7,
      returnTo: 'biochem_week',
      options: [
        { text: '重点章节回到正常速度精听', label: '均衡', effects: { skill: 8, stress: 3 } },
        { text: '全程倍速，把时间省给刷题', effects: { skill: 5, stress: -4, ethics: -2 } }
      ]
    },
    {
      id: 're_ug_hospital_volunteer',
      stage: 'undergrad',
      title: '🎲 门诊导医志愿服务',
      text: '你在自助机前教了三十位老人怎么取号，嗓子哑了，也第一次看清医院的另一面。',
      rarity: 'common',
      weight: 8,
      returnTo: 'campus_meme_night',
      options: [
        { text: '坚持做满一学期', label: '长期主义', effects: { ethics: 12, network: 8, health: -4, stress: 3 } },
        { text: '做完这次就好，重心还是学业', effects: { skill: 6, ethics: 3 } }
      ]
    },
    {
      id: 're_ug_exam_leak',
      stage: 'undergrad',
      title: '🎲 群里流出的“往年真题”',
      text: '有人发来一份压缩包，文件名写着“内部题库，勿外传”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'biochem_week',
      options: [
        { text: '不下载，按自己的复习计划走', label: '稳妥', effects: { ethics: 10, skill: 6, stress: 5, legalRisk: -5 } },
        { text: '下载了，但只当练习题用', effects: { skill: 8, ethics: -4, stress: 3 } },
        { text: '举报给教务，宁可得罪人', effects: { ethics: 14, legalRisk: -8, network: -10, stress: 8 } }
      ]
    },
    {
      id: 're_ug_roommate_dropout',
      stage: 'undergrad',
      title: '🎲 室友想退学重考',
      text: '他把《系统解剖学》塞进箱子最底下：“我可能真的不适合。”',
      rarity: 'uncommon',
      weight: 5,
      returnTo: 'campus_meme_night',
      options: [
        { text: '陪他聊一整夜，帮他理清楚', label: '团队协作', effects: { ethics: 10, network: 8, health: -5, stress: 4 } },
        { text: '尊重他的选择，帮他搬箱子', effects: { ethics: 6, network: 4, stress: 3 } }
      ]
    },
    {
      id: 're_ug_ai_homework',
      stage: 'undergrad',
      title: '🎲 用 AI 写综述作业',
      text: '生成的文字很漂亮，但你翻遍数据库都找不到它引用的那三篇文献。',
      rarity: 'common',
      weight: 8,
      returnTo: 'biochem_week',
      options: [
        { text: '当草稿用，所有引用逐条核对', label: '均衡', effects: { skill: 10, research: 5, stress: 4, legalRisk: -3 } },
        { text: '原样交上去，赌老师不查', effects: { stress: -4, ethics: -8, legalRisk: 10 } }
      ]
    },
    {
      id: 're_romance_undergrad',
      stage: 'undergrad',
      title: '🎲 自习室的心动',
      text: '一次通宵复习后，那个总帮你占座的人递来一杯还温着的奶茶。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'clerkship_intro',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        {
          text: '鼓起勇气，认真开始一段关系',
          check: {
            baseChance: 62,
            stats: { stress: -0.35, ethics: 0.2, network: 0.3, health: 0.15 },
            minChance: 25,
            maxChance: 90,
            success: {
              effects: { stress: -12, health: 8 },
              flagsSet: ['has_partner'],
              delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '有人分担情绪，你的压力被慢慢稀释。' }],
              feedback: '你们彼此靠近，成了对方的减压阀。',
              log: '💞 你开始了人生第一段认真的感情。'
            },
            failure: { effects: { stress: 6 }, feedback: '时机不对，你们只是擦肩而过。', log: '感情的事，急不来。' }
          }
        },
        { text: '先做朋友，一起复习也不错', label: '均衡', effects: { network: 8, skill: 5, stress: -4 } },
        { text: '现在重心还是学业', label: '长期主义', effects: { skill: 10, stress: 3 } }
      ]
    },
    {
      id: 're_ug_partner_study',
      stage: 'undergrad',
      title: '🎲 两个人的自习室',
      text: 'TA 把你的错题本整理得比你自己还整齐。',
      rarity: 'common',
      weight: 6,
      returnTo: 'biochem_week',
      requireFlags: ['has_partner'],
      options: [
        { text: '一起制定复习计划，互相监督', label: '团队协作', effects: { skill: 10, stress: -8, health: 4 } },
        { text: '学着学着就跑去看电影了', label: '休息', effects: { stress: -12, health: 6, skill: -4, money: -5 } }
      ]
    },
    {
      id: 're_ug_hometown_gap',
      stage: 'undergrad',
      title: '🎲 寒假回家的落差',
      text: '同龄人已经在工作、恋爱、攒首付，而你还要再读四年。',
      rarity: 'common',
      weight: 7,
      returnTo: 'campus_meme_night',
      options: [
        { text: '承认焦虑，但相信自己的时间表', label: '长期主义', effects: { ethics: 6, stress: -6, skill: 4 } },
        { text: '越比越慌，假期都没睡好', effects: { stress: 12, health: -6 } },
        { text: '找同班同学吐槽一晚上', label: '团队协作', effects: { network: 8, stress: -8, health: 3 } }
      ]
    },

    {
      id: 're_advisor_pivot',
      stage: 'graduate',
      title: '🎲 导师突然换方向',
      text: '组会上导师宣布课题整体转向，你半年的积累要推倒重来。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'lab_entry',
      options: [
        { text: '快速跟上新方向，抢占先机', label: '激进', effects: { research: 14, stress: 10, health: -5 } },
        { text: '和导师谈判，保留部分旧课题', label: '团队协作', effects: { research: 8, network: 6, stress: 5 } },
        { text: '先把新方向的文献读透再动手', label: '稳妥', effects: { research: 8, skill: 4, stress: 3 } }
      ]
    },
    {
      id: 're_lab_fire',
      stage: 'graduate',
      title: '🎲 隔壁实验室着火了',
      text: '警报大作，全楼疏散，你的细胞培养箱前途未卜。',
      rarity: 'rare',
      weight: 3,
      returnTo: 'experiment_failure',
      options: [
        { text: '冷静按流程疏散并记录损失', label: '稳妥', effects: { ethics: 8, network: 6, stress: 6, legalRisk: -5 } },
        { text: '冒险冲回去抢救样本', label: '激进', effects: { research: 8, health: -14, legalRisk: 8, stress: 12 } }
      ]
    },
    {
      id: 're_fraud_pressure',
      stage: 'graduate',
      title: '🎲 “把数据改好看一点”',
      text: '师兄暗示你，把几个离群点删掉，文章就能上一个档次。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'paper_deadline',
      options: [
        { text: '坚决拒绝，宁慢勿假', label: '稳妥', effects: { ethics: 12, research: 5, stress: 6, legalRisk: -6 } },
        { text: '把离群点写进讨论，做敏感性分析', label: '均衡', effects: { research: 10, ethics: 8, stress: 5 } },
        {
          text: '心动了，动了手脚',
          effects: { research: 8, legalRisk: 14, ethics: -14 },
          flagsSet: ['questionable_research'],
          delayed: [{ turns: 3, effects: { legalRisk: 10, stress: 10 }, log: '一封匿名举报邮件让你彻夜难眠。' }]
        }
      ]
    },
    {
      id: 're_rotation',
      stage: 'graduate',
      title: '🎲 临床轮转月',
      text: '你被轮到一个以“魔鬼带教”闻名的科室，节奏直接拉满。',
      rarity: 'common',
      weight: 8,
      returnTo: 'grad_admission',
      options: [
        { text: '死磕两周，能力肉眼可见地涨', label: '激进', effects: { skill: 14, stress: 10, health: -6 } },
        { text: '稳扎稳打，保住身心', label: '稳妥', effects: { skill: 7, health: 5, stress: 2 } },
        { text: '和同期分工整理病种笔记', label: '团队协作', effects: { skill: 9, network: 8, stress: 3 } }
      ]
    },
    {
      id: 're_roommate_breakup',
      stage: 'graduate',
      title: '🎲 室友失恋了',
      text: '深夜，室友哭着敲你的门，情绪濒临崩溃。',
      rarity: 'common',
      weight: 7,
      returnTo: 'conference_choice',
      options: [
        { text: '陪聊到天亮，第二天顶着黑眼圈', effects: { ethics: 8, network: 8, health: -6, stress: 4 } },
        { text: '安慰几句，劝其早睡', effects: { network: 4, stress: 2 } },
        { text: '陪他去学校心理中心预约', label: '团队协作', effects: { ethics: 10, network: 6, health: -3, stress: 2 } }
      ]
    },
    {
      id: 're_gd_group_meeting',
      stage: 'graduate',
      title: '🎲 组会公开处刑',
      text: '你的进度汇报被逐页拆解，最后一页 PPT 还没放完就被叫停了。',
      rarity: 'common',
      weight: 9,
      returnTo: 'lab_entry',
      options: [
        { text: '当场记录所有质疑，会后逐条回应', label: '稳妥', effects: { research: 10, skill: 5, stress: 6 } },
        { text: '据理力争，把自己的逻辑讲完', label: '激进', effects: { research: 8, network: -6, stress: 8, ethics: 4 } },
        { text: '沉默到散会，回去偷偷崩溃', effects: { stress: 14, health: -6, research: 3 } }
      ]
    },
    {
      id: 're_gd_reagent_shortage',
      stage: 'graduate',
      title: '🎲 关键试剂断供',
      text: '厂家通知交期延后两个月，而你的实验刚跑到一半。',
      rarity: 'common',
      weight: 8,
      returnTo: 'experiment_failure',
      options: [
        { text: '向兄弟课题组借用并写清归还计划', label: '团队协作', effects: { network: 10, research: 8, stress: 3 } },
        { text: '自掏腰包买高价现货', effects: { money: -16, research: 10, stress: 4 } },
        { text: '改用替代方案，重新验证条件', label: '长期主义', effects: { research: 6, skill: 6, stress: 6, health: -3 } }
      ]
    },
    {
      id: 're_gd_animal_ethics',
      stage: 'graduate',
      title: '🎲 伦理审查被退回',
      text: '动物实验方案被要求补充麻醉与终点指标说明，进度条又停了。',
      rarity: 'common',
      weight: 8,
      returnTo: 'lab_entry',
      options: [
        { text: '认真补齐材料，顺便学透伦理规范', label: '稳妥', effects: { ethics: 10, legalRisk: -8, research: 5, stress: 4 } },
        { text: '抱怨流程繁琐，草草改几句再交', effects: { stress: 5, ethics: -5, legalRisk: 8, research: 3 } }
      ]
    },
    {
      id: 're_gd_paper_rejected',
      stage: 'graduate',
      title: '🎲 第一封拒稿信',
      text: '编辑用最礼貌的措辞说明了最残酷的意思：不送外审。',
      rarity: 'common',
      weight: 9,
      returnTo: 'paper_deadline',
      options: [
        { text: '拆解意见，改投更合适的期刊', label: '稳妥', effects: { research: 10, skill: 4, stress: 4 } },
        { text: '连夜大改，冲更高影响因子', label: '激进', effects: { research: 12, stress: 12, health: -6 } },
        { text: '先放一放，去操场跑五公里', label: '休息', effects: { health: 10, stress: -12, research: 2 } }
      ]
    },
    {
      id: 're_gd_junior_student',
      stage: 'graduate',
      title: '🎲 带一个刚进组的师弟',
      text: '他连移液枪都拿反了，但眼神里全是当年的你。',
      rarity: 'common',
      weight: 8,
      returnTo: 'lab_entry',
      options: [
        { text: '手把手带一个月，顺便理清自己的思路', label: '团队协作', effects: { network: 10, ethics: 8, skill: 6, stress: 5 } },
        { text: '丢一份 SOP 让他自己摸索', effects: { research: 5, stress: -3, network: -4 } }
      ]
    },
    {
      id: 're_gd_stipend_delay',
      stage: 'graduate',
      title: '🎲 补助又晚发了两个月',
      text: '每月的补助数额本就不多，现在连这点也要等。',
      rarity: 'common',
      weight: 8,
      returnTo: 'grad_admission',
      options: [
        { text: '接横向项目的活儿补贴生活', effects: { money: 14, research: 4, stress: 6, health: -4 } },
        { text: '和同学一起去问研究生院', label: '团队协作', effects: { network: 8, money: 6, stress: 3 } },
        { text: '省吃俭用扛过去', label: '稳妥', effects: { money: -6, health: -5, stress: 6, ethics: 3 } }
      ]
    },
    {
      id: 're_gd_poster_session',
      stage: 'graduate',
      title: '🎲 壁报前的十分钟',
      text: '一位陌生教授在你的海报前停下，问了一个你从没想过的问题。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'conference_choice',
      options: [
        { text: '坦承不知道，并当场记下来回去查', label: '稳妥', effects: { ethics: 10, research: 8, network: 6, stress: 3 } },
        { text: '硬编一个听起来专业的答案', effects: { network: 3, ethics: -6, stress: 6 } }
      ]
    },
    {
      id: 're_gd_stats_course',
      stage: 'graduate',
      title: '🎲 补一门统计学',
      text: '你终于承认：自己一直在用不太懂的检验方法处理数据。',
      rarity: 'common',
      weight: 8,
      returnTo: 'experiment_failure',
      options: [
        { text: '系统学一遍，重跑所有分析', label: '长期主义', effects: { research: 12, skill: 8, stress: 6, health: -3 } },
        { text: '找统计老师做一次咨询', label: '团队协作', effects: { research: 8, network: 6, money: -6 } },
        { text: '继续套用师兄的代码模板', effects: { research: 4, ethics: -4, legalRisk: 5, stress: 3 } }
      ]
    },
    {
      id: 're_gd_pi_company',
      stage: 'graduate',
      title: '🎲 导师的公司让你去“帮忙”',
      text: '名义上是实践锻炼，实际是无偿加班，而且和你的课题毫无关系。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'project_delay',
      options: [
        { text: '委婉说明课题进度，划清边界', label: '稳妥', effects: { ethics: 10, stress: 6, network: -5, research: 5 } },
        { text: '去，但要求折算工时与署名', label: '团队协作', effects: { network: 8, money: 10, ethics: 4, stress: 5 } },
        { text: '全盘接受，课题继续拖', effects: { network: 6, money: 6, research: -8, stress: 10 } }
      ]
    },
    {
      id: 're_gd_clinic_vs_lab',
      stage: 'graduate',
      title: '🎲 门诊和实验撞在同一天',
      text: '导师要你上台汇报，主任要你跟台手术，两个微信同时在闪。',
      rarity: 'common',
      weight: 9,
      returnTo: 'project_delay',
      options: [
        { text: '提前协调两边，换出一个时间窗', label: '团队协作', effects: { network: 10, skill: 5, research: 5, stress: 5 } },
        { text: '硬着头皮两边跑', label: '激进', effects: { skill: 8, research: 6, health: -10, stress: 12 } },
        { text: '优先临床，科研进度让位', effects: { skill: 10, research: -5, stress: 4 } }
      ]
    },
    {
      id: 're_gd_peer_publish',
      stage: 'graduate',
      title: '🎲 同门先发了文章',
      text: '朋友圈九宫格里，是你熟悉的那个课题方向。',
      rarity: 'common',
      weight: 8,
      returnTo: 'paper_deadline',
      options: [
        { text: '真诚道贺，并请教投稿经验', label: '团队协作', effects: { network: 10, research: 6, stress: -4 } },
        { text: '闷头加速自己的进度', effects: { research: 10, stress: 10, health: -5 } },
        { text: '陷入内耗，一周没进实验室', effects: { stress: 14, research: -5, health: -4 } }
      ]
    },
    {
      id: 're_gd_gastritis',
      stage: 'graduate',
      title: '🎲 胃开始抗议了',
      text: '连续几个月的外卖和夜宵之后，你在实验台前疼得直不起腰。',
      rarity: 'common',
      weight: 8,
      returnTo: 'experiment_failure',
      options: [
        { text: '去消化科认真查一次，调整饮食', label: '休息', effects: { health: 14, stress: -8, money: -8, research: -3 } },
        { text: '买盒药顶着，实验不能停', effects: { health: -12, research: 6, stress: 8 } }
      ]
    },
    {
      id: 're_gd_public_dataset',
      stage: 'graduate',
      title: '🎲 公共数据库里的金矿',
      text: '你发现一个开放数据库，或许能在不做实验的情况下产出一篇文章。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'paper_revision_year',
      options: [
        { text: '规范引用与方法学，认真做一篇', label: '均衡', effects: { research: 12, skill: 6, stress: 4, ethics: 4 } },
        { text: '批量跑分析，流水线式产文', effects: { research: 10, money: 5, ethics: -8, legalRisk: 6 } },
        { text: '不碰，还是回到自己的实验', label: '长期主义', effects: { research: 5, skill: 5, stress: 3 } }
      ]
    },
    {
      id: 're_gd_pre_defense',
      stage: 'graduate',
      title: '🎲 预答辩现场',
      text: '评审老师翻到你的第 42 页，抬头问：“这个结论，你自己信吗？”',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'paper_revision_year',
      options: [
        { text: '承认局限，提出补充验证方案', label: '稳妥', effects: { ethics: 10, research: 8, stress: 5 } },
        { text: '强撑辩护，把话说满', effects: { stress: 10, ethics: -5, research: 3, legalRisk: 4 } }
      ]
    },
    {
      id: 're_romance_graduate',
      stage: 'graduate',
      title: '🎲 组会外的暧昧',
      text: '隔壁课题组的 TA 总在食堂和你“恰好”同桌。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'conference_choice',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        {
          text: '把握机会，主动约一次',
          check: {
            baseChance: 60,
            stats: { stress: -0.35, network: 0.3, ethics: 0.2, health: 0.15 },
            minChance: 25,
            maxChance: 88,
            success: {
              effects: { stress: -12, health: 6 },
              flagsSet: ['has_partner'],
              delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '两个人一起熬科研的夜，好像没那么难熬了。' }],
              feedback: '你们成了彼此的实验室战友与港湾。',
              log: '💞 你在读研期间收获了一段感情。'
            },
            failure: { effects: { stress: 5 }, feedback: '对方似乎另有安排，你识趣地退回了朋友区。', log: '缘分未到，先做同行朋友。' }
          }
        },
        { text: '不想分心，先保课题', label: '长期主义', effects: { research: 8, stress: 3 } }
      ]
    },
    {
      id: 're_single_life',
      stage: 'graduate',
      title: '🎲 关于“一个人”的想法',
      text: '看着身边人忙着脱单，你却越来越享受一个人的清净。',
      rarity: 'common',
      weight: 5,
      returnTo: 'conference_choice',
      forbidFlags: ['has_partner', 'married', 'single_choice'],
      options: [
        { text: '坦然选择单身，把人生过给自己', label: '长期主义', effects: { stress: -12, health: 8, skill: 6 }, flagsSet: ['single_choice'] },
        { text: '顺其自然，不急', effects: { stress: -4, health: 3 } }
      ]
    },
    {
      id: 're_relationship_longdistance',
      stage: 'graduate',
      title: '🎲 异地的考验',
      text: '你和 TA 被分到了不同城市，见面成了需要提前两周规划的事。',
      rarity: 'common',
      weight: 6,
      returnTo: 'conference_choice',
      requireFlags: ['has_partner'],
      forbidFlags: ['married'],
      options: [
        { text: '用心经营，每周雷打不动视频', label: '长期主义', effects: { stress: -8, network: 4, money: -6, health: 3 } },
        { text: '各自忙各自的，慢慢降温', effects: { stress: 10, ethics: -4, health: -3 } },
        { text: '摊开谈未来的城市规划', label: '团队协作', effects: { stress: -5, ethics: 6, network: 4 } }
      ]
    },

    {
      id: 're_exam_anxiety',
      stage: 'training',
      title: '🎲 执医考前焦虑',
      text: '距离考试还有两周，你开始失眠、心慌、看不进书。',
      rarity: 'common',
      weight: 9,
      returnTo: 'license_exam_prep',
      options: [
        { text: '调整作息，规律运动减压', label: '休息', effects: { health: 12, stress: -14, skill: 3 } },
        { text: '硬刷题到深夜', label: '激进', effects: { skill: 12, stress: 10, health: -8 } },
        { text: '找上岸的师兄取经', label: '团队协作', effects: { skill: 8, network: 8, stress: -6 } }
      ]
    },
    {
      id: 're_first_night_shift',
      stage: 'training',
      title: '🎲 规培第一个独立夜班',
      text: '带教去休息了，值班室只剩你和一整层的患者。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'drg_bootcamp',
      options: [
        { text: '一丝不苟处理每一个呼叫', effects: { skill: 12, stress: 10, legalRisk: -6, health: -5 } },
        { text: '拿不准就电话请示上级', label: '稳妥', effects: { skill: 8, network: 8, legalRisk: -5, stress: 4 } },
        { text: '照着模板处理，能过就行', effects: { skill: 3, legalRisk: 8, ethics: -4, stress: -3 } }
      ]
    },
    {
      id: 're_teacher_strict',
      stage: 'training',
      title: '🎲 带教是严格型',
      text: '你的带教查房像庭审，每个细节都要你说清楚为什么。',
      rarity: 'common',
      weight: 8,
      returnTo: 'residency_match',
      options: [
        { text: '把每次盘问当作免费特训', label: '长期主义', effects: { skill: 14, ethics: 6, stress: 8 } },
        { text: '按要求做，尽量别出错', label: '稳妥', effects: { skill: 7, stress: 4, legalRisk: -3 } }
      ]
    },
    {
      id: 're_teacher_handsoff',
      stage: 'training',
      title: '🎲 带教是放养型',
      text: '带教把你丢进临床就消失了，全靠自己摸索。',
      rarity: 'common',
      weight: 8,
      returnTo: 'grassroots_early',
      options: [
        { text: '主动出击，抓住每个学习机会', label: '激进', effects: { skill: 12, network: 6, stress: 6 } },
        { text: '边做边查，稳中求进', label: '稳妥', effects: { skill: 7, health: 3, stress: 2, legalRisk: -3 } },
        { text: '找同期组个互助小组', label: '团队协作', effects: { skill: 8, network: 10, stress: -4 } }
      ]
    },
    {
      id: 're_tr_stipend_low',
      stage: 'training',
      title: '🎲 规培补助与房租',
      text: '到手的补助，减去房租之后是一个让人沉默的数字。',
      rarity: 'common',
      weight: 9,
      returnTo: 'license_exam_prep',
      options: [
        { text: '和同期合租，压缩开销', label: '稳妥', effects: { money: 12, network: 6, health: -3 } },
        { text: '周末去做医学科普写作', effects: { money: 14, skill: 5, health: -6, stress: 6 } },
        { text: '找家里再支援一段时间', effects: { money: 10, ethics: -4, stress: 5 } }
      ]
    },
    {
      id: 're_tr_osce',
      stage: 'training',
      title: '🎲 技能考核（OSCE）',
      text: '标准化病人一脸严肃，考官的评分表上有 27 个采分点。',
      rarity: 'common',
      weight: 8,
      returnTo: 'license_exam_prep',
      options: [
        { text: '按流程一步步来，宁慢勿漏', label: '稳妥', effects: { skill: 10, legalRisk: -5, stress: 4 } },
        { text: '和同期反复对练到肌肉记忆', label: '团队协作', effects: { skill: 12, network: 8, stress: 5, health: -3 } }
      ]
    },
    {
      id: 're_tr_needle_stick',
      stage: 'training',
      title: '🎲 针刺伤',
      text: '拔针的一瞬间，针尖擦过了你的手指。患者的化验结果还没回来。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'drg_bootcamp',
      options: [
        { text: '立即冲洗上报，走职业暴露流程', label: '稳妥', effects: { health: 5, legalRisk: -10, ethics: 8, stress: 8 } },
        { text: '怕麻烦，自己贴个创可贴了事', effects: { health: -12, legalRisk: 10, stress: 14, ethics: -4 } }
      ]
    },
    {
      id: 're_tr_first_death',
      stage: 'training',
      title: '🎲 你签的第一张死亡记录',
      text: '抢救停止的那一刻，走廊里的哭声比监护仪的长音还要长。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'drg_bootcamp',
      options: [
        { text: '认真做完所有交代与记录，再去楼梯间坐十分钟', effects: { ethics: 12, legalRisk: -6, stress: 10, health: -4 } },
        { text: '和同期聊一聊，别把情绪憋住', label: '团队协作', effects: { network: 8, stress: -8, ethics: 6 } },
        { text: '强行麻木，继续下一个病人', effects: { skill: 5, ethics: -6, stress: 12 } }
      ]
    },
    {
      id: 're_tr_dept_transfer',
      stage: 'training',
      title: '🎲 转科申请',
      text: '你想去急诊多练手，但科教科说名额已经排满了。',
      rarity: 'common',
      weight: 8,
      returnTo: 'residency_match',
      options: [
        { text: '写份正式申请，把理由讲清楚', label: '稳妥', effects: { network: 6, skill: 5, stress: 3 } },
        { text: '托关系插队', effects: { network: 8, skill: 6, ethics: -8, legalRisk: 5 } },
        { text: '接受安排，在现有科室做到最好', label: '长期主义', effects: { skill: 8, ethics: 6, stress: 2 } }
      ]
    },
    {
      id: 're_tr_night_meal',
      stage: 'training',
      title: '🎲 凌晨四点的泡面',
      text: '值班室的泡面香气引来了三个同样没吃晚饭的同事。',
      rarity: 'common',
      weight: 8,
      returnTo: 'grassroots_early',
      options: [
        { text: '分着吃，顺便交换各科的生存经验', label: '团队协作', effects: { network: 10, stress: -8, health: -3 } },
        { text: '自己吃完继续写病历', effects: { skill: 6, stress: 4, health: -4 } }
      ]
    },
    {
      id: 're_tr_senior_dump',
      stage: 'training',
      title: '🎲 上级把活全甩给你',
      text: '“这几份出院小结你写一下，我先走了。”门在你面前关上。',
      rarity: 'common',
      weight: 9,
      returnTo: 'residency_waitlist',
      options: [
        { text: '写完，但把工作量如实记录留痕', label: '稳妥', effects: { skill: 8, legalRisk: -5, stress: 6, ethics: 4 } },
        { text: '默默全接，换个好评价', effects: { network: 8, skill: 5, health: -8, stress: 10 } },
        { text: '和同期一起向科教科反映', label: '团队协作', effects: { network: 5, ethics: 8, stress: 6, legalRisk: -4 } }
      ]
    },
    {
      id: 're_tr_support_mission',
      stage: 'training',
      title: '🎲 临时支援任务',
      text: '接到通知：三天后出发，去支援一个床位紧张的基层医院。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'grassroots_early',
      options: [
        { text: '主动报名，去看看真正缺医少药的地方', effects: { ethics: 12, skill: 8, network: 6, health: -6, stress: 6 } },
        { text: '如实说明身体状况，申请缓一批', label: '稳妥', effects: { health: 6, stress: -5, network: -4 } }
      ]
    },
    {
      id: 're_tr_family_pressure',
      stage: 'training',
      title: '🎲 家里催你回老家',
      text: '“县医院给编制，还包分房，你还熬什么？”电话那头很有说服力。',
      rarity: 'common',
      weight: 8,
      returnTo: 'residency_match',
      options: [
        { text: '认真算一笔账，再和家人摊开谈', label: '均衡', effects: { network: 6, ethics: 6, stress: -5, money: 4 } },
        { text: '坚持留在现在的平台', label: '长期主义', effects: { skill: 8, stress: 8, network: -4 } },
        { text: '动摇了，开始投老家的简历', effects: { money: 10, stress: 5, skill: -3 } }
      ]
    },
    {
      id: 're_tr_record_audit',
      stage: 'training',
      title: '🎲 病历质控通报',
      text: '你的三份病历被点名：主诉与现病史时间线对不上。',
      rarity: 'common',
      weight: 8,
      returnTo: 'drg_bootcamp',
      options: [
        { text: '逐份重写，并整理一份自查清单', label: '稳妥', effects: { skill: 10, legalRisk: -10, stress: 6 } },
        { text: '按最低要求改完交差', effects: { stress: -3, legalRisk: 6, skill: 2 } }
      ]
    },
    {
      id: 're_tr_thesis_conflict',
      stage: 'training',
      title: '🎲 规培与论文的双线作战',
      text: '专硕的毕业论文还差两章，而下周开始你要连上六个夜班。',
      rarity: 'common',
      weight: 8,
      returnTo: 'license_exam_prep',
      options: [
        { text: '和导师沟通，把时间表重新排一遍', label: '团队协作', effects: { network: 8, research: 6, stress: -5 } },
        { text: '夜班间隙写论文，两头硬扛', label: '激进', effects: { research: 10, skill: 5, health: -12, stress: 14 } },
        { text: '申请延期答辩，先保临床', label: '稳妥', effects: { skill: 8, stress: -4, research: -4, money: -5 } }
      ]
    },
    {
      id: 're_romance_training',
      stage: 'training',
      title: '🎲 规培基地的同期',
      text: '同期里有个人，总在你崩溃的夜班默默递上一份关东煮。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'drg_bootcamp',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        {
          text: '同是天涯规培人，试着在一起',
          check: {
            baseChance: 64,
            stats: { stress: -0.3, network: 0.3, ethics: 0.2, health: 0.15 },
            minChance: 28,
            maxChance: 90,
            success: {
              effects: { stress: -12, health: 8 },
              flagsSet: ['has_partner'],
              delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '有人和你一起吐槽夜班，压力被消化了一半。' }],
              feedback: '你们在最累的阶段成了彼此的支撑。',
              log: '💞 你在规培期间收获了一段感情。'
            },
            failure: { effects: { stress: 5 }, feedback: '排班错开、聚少离多，最终没能走近。', log: '规培太忙，感情被排班拆散。' }
          }
        },
        { text: '现在自顾不暇，先扛过规培', label: '长期主义', effects: { skill: 8, stress: 4 } }
      ]
    },
    {
      id: 're_tr_partner_support',
      stage: 'training',
      title: '🎲 有人在楼下等你下班',
      text: '你走出住院楼时已是深夜，TA 举着一杯热豆浆站在路灯下。',
      rarity: 'common',
      weight: 6,
      returnTo: 'drg_bootcamp',
      requireFlags: ['has_partner'],
      options: [
        { text: '好好吃顿宵夜，聊聊今天的病人', effects: { stress: -12, health: 8, money: -4 } },
        { text: '太累了，只说了句谢谢就上楼睡了', effects: { health: 6, stress: -3, ethics: -3 } }
      ]
    },
    {
      id: 're_marriage',
      stage: 'training',
      title: '🎲 要不要领证',
      text: '感情稳定了几年，双方父母开始追问：什么时候把证领了？',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'drg_bootcamp',
      requireFlags: ['has_partner'],
      forbidFlags: ['married'],
      options: [
        {
          text: '步入婚姻，成家立业',
          effects: { stress: -10, health: 6, money: -12, network: 8 },
          flagsSet: ['married'],
          delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '成家之后，你有了一个真正意义上的后盾。' }]
        },
        { text: '先领证，婚礼等不忙了再办', label: '稳妥', effects: { stress: -6, money: -3, ethics: 4, health: 3 }, flagsSet: ['married'] },
        { text: '再等等，事业稳一点再说', label: '长期主义', effects: { stress: 5, skill: 6 } }
      ]
    },

    {
      id: 're_sudden_overtime',
      stage: 'resident',
      title: '🎲 突发批量伤员',
      text: '一场事故送来大批伤员，你的下班时间被无限延后。',
      rarity: 'common',
      weight: 9,
      returnTo: 'ward_rounds',
      options: [
        { text: '顶上去，全力抢救', effects: { skill: 12, ethics: 10, health: -10, stress: 12 } },
        { text: '有序分诊，量力而为', label: '稳妥', effects: { skill: 8, network: 6, stress: 6, legalRisk: -4 } },
        { text: '按预案分工，把新人也带起来', label: '团队协作', effects: { network: 10, skill: 6, ethics: 6, stress: 8 } }
      ]
    },
    {
      id: 're_minor_dispute',
      stage: 'resident',
      title: '🎲 一次小小的医患摩擦',
      text: '家属觉得你态度冷淡，当场提高了嗓门。',
      rarity: 'common',
      weight: 9,
      returnTo: 'patient_talk',
      options: [
        { text: '放下手头事，耐心解释安抚', label: '稳妥', effects: { ethics: 10, legalRisk: -10, stress: 5 } },
        { text: '公事公办，走流程', effects: { legalRisk: 6, ethics: -5, stress: -3 } },
        { text: '请护士长一起沟通并留痕', label: '团队协作', effects: { network: 8, legalRisk: -8, stress: 3 } }
      ]
    },
    {
      id: 're_ai_tool',
      stage: 'resident',
      title: '🎲 新上线的 AI 辅诊',
      text: '医院推了一款 AI 辅助诊断工具，同事们的态度两极分化。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'ai_and_online',
      options: [
        { text: '当参考，关键结论人工复核', label: '均衡', effects: { skill: 10, legalRisk: -6, stress: -3 }, flagsSet: ['ai_prudent'] },
        { text: '图省事，基本照搬', effects: { stress: -6, legalRisk: 12, ethics: -6 }, flagsSet: ['ai_overtrust'] },
        { text: '牵头做一次科内评测，写份使用规范', label: '团队协作', effects: { network: 10, skill: 6, legalRisk: -8, stress: 5 }, flagsSet: ['ai_prudent'] }
      ]
    },
    {
      id: 're_drg_pressure',
      stage: 'resident',
      title: '🎲 病组超支预警',
      text: '系统弹窗提示你管的病组成本又超了，绩效面临扣分。',
      rarity: 'common',
      weight: 8,
      returnTo: 'performance_review',
      options: [
        { text: '优化路径，合理控费不伤诊疗', label: '均衡', effects: { skill: 8, money: 6, ethics: 6, stress: 5 } },
        { text: '压检查、压耗材冲指标', effects: { money: 12, ethics: -8, legalRisk: 10, stress: 4 } },
        { text: '把超支原因写成分析报告交给科室', label: '团队协作', effects: { network: 8, skill: 6, money: -3, stress: 4 } }
      ]
    },
    {
      id: 're_colleague_wedding',
      stage: 'resident',
      title: '🎲 同事的婚礼',
      text: '科室难得凑齐人去喝喜酒，可你正好排了班。',
      rarity: 'common',
      weight: 8,
      returnTo: 'night_shift_call',
      options: [
        { text: '换班去参加，联络感情', effects: { network: 10, stress: -8, money: -6, health: 4 } },
        { text: '留守值班，发个大红包', effects: { network: 5, money: -8, stress: 4 } }
      ]
    },
    {
      id: 're_rs_drug_rep',
      stage: 'resident',
      title: '🎲 一张“学术会议邀请函”',
      text: '厂家代表笑容可掬：“交通住宿全包，就想请您分享一下用药经验。”',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'performance_review',
      options: [
        { text: '婉拒一切利益输送，只参加公开学术活动', label: '稳妥', effects: { ethics: 12, legalRisk: -10, network: -4, stress: 3 } },
        { text: '按规定报备后参加，讲循证内容', label: '均衡', effects: { network: 8, research: 6, ethics: 4, legalRisk: -3 } },
        {
          text: '来者不拒，反正大家都这样',
          effects: { money: 14, network: 6, ethics: -12, legalRisk: 14 },
          delayed: [{ turns: 3, effects: { legalRisk: 10, stress: 10 }, log: '院纪检部门开始核查一批会议劳务记录。' }]
        }
      ]
    },
    {
      id: 're_rs_vip_patient',
      stage: 'resident',
      title: '🎲 “这是我朋友，麻烦关照一下”',
      text: '一条来自领导的微信，附带一个已经在排队的患者名字。',
      rarity: 'common',
      weight: 8,
      returnTo: 'patient_talk',
      options: [
        { text: '按规范收治，不给特殊插队', label: '稳妥', effects: { ethics: 12, legalRisk: -8, network: -8, stress: 6 } },
        { text: '在制度允许范围内做好解释和衔接', label: '均衡', effects: { network: 6, ethics: 4, stress: 3 } },
        { text: '直接加号插队，让所有人都往后挪', effects: { network: 10, ethics: -10, legalRisk: 8, stress: 5 } }
      ]
    },
    {
      id: 're_rs_shift_swap',
      stage: 'resident',
      title: '🎲 同事请你顶班',
      text: '“我家孩子发烧，能不能帮我顶一个夜班？”消息发来时是凌晨一点。',
      rarity: 'common',
      weight: 9,
      returnTo: 'night_shift_call',
      options: [
        { text: '答应下来，人情账以后再算', label: '团队协作', effects: { network: 12, ethics: 8, health: -8, stress: 8 } },
        { text: '如实说明自己也连轴转，帮他找别人', label: '稳妥', effects: { network: 5, health: 5, stress: -3, ethics: 4 } },
        { text: '直接拒绝，不解释', effects: { health: 6, network: -10, stress: -3 } }
      ]
    },
    {
      id: 're_rs_equipment_fail',
      stage: 'resident',
      title: '🎲 关键设备半夜罢工',
      text: '监护仪报警声不对劲，工程师在电话里说“明早才能到”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'night_shift_call',
      options: [
        { text: '启用备用方案并全程书面记录', label: '稳妥', effects: { skill: 10, legalRisk: -10, stress: 8 } },
        { text: '联系兄弟科室临时借设备', label: '团队协作', effects: { network: 10, skill: 5, stress: 5 } },
        { text: '将就着用，希望撑到天亮', effects: { stress: 10, legalRisk: 12, ethics: -6 } }
      ]
    },
    {
      id: 're_rs_teaching_intern',
      stage: 'resident',
      title: '🎲 实习生把医嘱开错了',
      text: '幸好药师拦下了。实习生站在你面前，脸白得像新的一张医嘱单。',
      rarity: 'common',
      weight: 8,
      returnTo: 'ward_rounds',
      options: [
        { text: '带他一起复盘，并完善双人核对流程', label: '团队协作', effects: { ethics: 10, skill: 8, legalRisk: -8, network: 6, stress: 4 } },
        { text: '当众严厉批评一顿', effects: { skill: 3, network: -8, ethics: -4, stress: 5 } },
        { text: '自己默默改掉，不上报也不追究', effects: { stress: 5, legalRisk: 8, ethics: -5 } }
      ]
    },
    {
      id: 're_rs_online_platform',
      stage: 'resident',
      title: '🎲 线上问诊平台的邀约',
      text: '平台承诺一条图文回复几十块，看起来是笔不错的外快。',
      rarity: 'common',
      weight: 8,
      returnTo: 'ai_and_online',
      options: [
        { text: '按医院规定报备后规范执业', label: '稳妥', effects: { money: 10, legalRisk: -5, ethics: 5, stress: 3 } },
        { text: '大量接单，深夜也在回复', effects: { money: 18, health: -10, stress: 12, legalRisk: 6 } },
        { text: '不碰线上，专心把住院工作做好', label: '长期主义', effects: { skill: 10, stress: -4 } }
      ]
    },
    {
      id: 're_rs_paper_quota',
      stage: 'resident',
      title: '🎲 晋升需要的那两篇文章',
      text: '临床忙得脚不沾地，可职称条件白纸黑字写着论文数量。',
      rarity: 'common',
      weight: 9,
      returnTo: 'performance_review',
      options: [
        { text: '从自己管过的病例入手做真实研究', label: '长期主义', effects: { research: 12, skill: 6, stress: 8, health: -4 } },
        { text: '找同事组队，分工合作出成果', label: '团队协作', effects: { research: 8, network: 10, stress: 4 } },
        {
          text: '花钱找“代写包发”',
          effects: { research: 6, money: -20, ethics: -12, legalRisk: 16 },
          flagsSet: ['paper_risk'],
          delayed: [{ turns: 3, effects: { legalRisk: 12, stress: 12 }, log: '期刊撤稿名单里出现了熟悉的题目。' }]
        }
      ]
    },
    {
      id: 're_rs_dept_meeting',
      stage: 'resident',
      title: '🎲 一场两小时的科务会',
      text: '议题是“如何提高效率”，会开了两小时，没有结论。',
      rarity: 'common',
      weight: 8,
      returnTo: 'performance_review',
      options: [
        { text: '提出一个可执行的小改进并主动认领', label: '团队协作', effects: { network: 10, skill: 5, stress: 4, ethics: 4 } },
        { text: '偷偷在桌下写病历', effects: { skill: 6, stress: 3, network: -4 } }
      ]
    },
    {
      id: 're_rs_patient_no_money',
      stage: 'resident',
      title: '🎲 交不起住院费的患者',
      text: '老人攥着皱巴巴的钱，说不做手术也行，回家躺着就好。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'patient_talk',
      options: [
        { text: '帮他对接医务社工与救助基金', label: '团队协作', effects: { ethics: 14, network: 8, stress: 6, legalRisk: -4 } },
        { text: '自己悄悄垫付了一部分', effects: { ethics: 10, money: -16, stress: 5 } },
        { text: '如实告知选项，尊重他的决定', label: '稳妥', effects: { ethics: 5, legalRisk: -5, stress: 6 } }
      ]
    },
    {
      id: 're_rs_flight_emergency',
      stage: 'resident',
      title: '🎲 “飞机上有医生吗？”',
      text: '广播响起时，你正戴着眼罩准备睡觉。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'consultation_lastminute',
      options: [
        { text: '起身应答，尽力处置并全程记录', effects: { ethics: 14, skill: 8, network: 8, stress: 10, health: -4 } },
        { text: '装作没听见，把眼罩往下拉了拉', effects: { stress: 8, ethics: -10, health: 3 } }
      ]
    },
    {
      id: 're_rs_flu_surge',
      stage: 'resident',
      title: '🎲 流感季，走廊都加满了床',
      text: '门诊量翻倍，同事接连倒下，你已经连续上了十天班。',
      rarity: 'common',
      weight: 9,
      returnTo: 'ward_rounds',
      options: [
        { text: '硬扛，科室不能塌', effects: { skill: 10, ethics: 8, health: -14, stress: 14 } },
        { text: '如实报告身体状况，申请调整排班', label: '稳妥', effects: { health: 10, stress: -8, network: -4 } },
        { text: '和同事排出轮休表，谁也别倒下', label: '团队协作', effects: { network: 12, health: 5, stress: -5, skill: 4 } }
      ]
    },
    {
      id: 're_rs_burnout',
      stage: 'resident',
      title: '🎲 早上不想起床的那一天',
      text: '闹钟响到第七遍，你盯着天花板，脑子里只有一句：还要多久。',
      rarity: 'common',
      weight: 9,
      returnTo: 'performance_review',
      options: [
        { text: '预约心理门诊，认真对待', label: '休息', effects: { health: 12, stress: -16, money: -6, ethics: 4 } },
        { text: '请一周年假，去看看海', label: '休息', effects: { health: 14, stress: -14, money: -12, skill: -3 } },
        { text: '灌两杯咖啡，继续上班', effects: { stress: 10, health: -8, skill: 4 } }
      ]
    },
    {
      id: 're_rs_red_envelope',
      stage: 'resident',
      title: '🎲 术前塞来的红包',
      text: '家属把信封硬塞进你的白大褂口袋：“图个安心，您别嫌少。”',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'patient_talk',
      options: [
        { text: '当场拒收，并解释这不影响治疗', label: '稳妥', effects: { ethics: 14, legalRisk: -10, stress: 5 } },
        { text: '先收下，术后交到住院处充抵费用', label: '均衡', effects: { ethics: 10, network: 5, legalRisk: -4, stress: 4 } },
        {
          text: '收下了，谁也不会知道',
          effects: { money: 12, ethics: -16, legalRisk: 16 },
          delayed: [{ turns: 2, effects: { legalRisk: 10, stress: 12 }, log: '一段走廊监控被翻了出来。' }]
        }
      ]
    },
    {
      id: 're_rs_parent_illness',
      stage: 'resident',
      title: '🎲 父母的体检报告',
      text: '你在值班室点开家里发来的报告单，手指停在“建议进一步检查”那一行。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'ward_rounds',
      options: [
        { text: '请假回家，陪他们把检查做完', effects: { ethics: 12, health: -4, stress: -6, money: -12, network: -3 } },
        { text: '托靠谱的同学安排，自己远程盯着', label: '团队协作', effects: { network: 10, ethics: 6, stress: 5, money: -6 } },
        { text: '安慰几句，等排班空了再说', effects: { stress: 12, ethics: -6, health: -3 } }
      ]
    },
    {
      id: 're_rs_physical_exam',
      stage: 'resident',
      title: '🎲 你自己的体检报告',
      text: '甲状腺结节、脂肪肝、血压偏高——你把报告塞进抽屉最底层。',
      rarity: 'common',
      weight: 8,
      returnTo: 'performance_review',
      options: [
        { text: '认真复查，调整作息和饮食', label: '休息', effects: { health: 14, stress: -8, money: -8, skill: -2 } },
        { text: '“医生不用看医生”，先放着', effects: { health: -12, stress: 8, legalRisk: 3 } }
      ]
    },
    {
      id: 're_rs_second_opinion',
      stage: 'resident',
      title: '🎲 患者拿着搜索结果来质疑',
      text: '“网上说这个药有严重副作用，你是不是想多开点检查？”',
      rarity: 'common',
      weight: 9,
      returnTo: 'patient_talk',
      options: [
        { text: '把指南和风险收益讲清楚，请他一起决策', label: '稳妥', effects: { ethics: 10, legalRisk: -8, skill: 6, stress: 5 } },
        { text: '冷冷回一句“你信网上就别来看病”', effects: { stress: -3, ethics: -8, legalRisk: 12, network: -5 } },
        { text: '请他先看一份科室做的科普材料', label: '团队协作', effects: { network: 6, ethics: 6, legalRisk: -5, stress: 2 } }
      ]
    },
    {
      id: 're_rs_ambulance',
      stage: 'resident',
      title: '🎲 随车出诊',
      text: '狭窄的楼道，六楼没有电梯，担架转不过弯。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'consultation_lastminute',
      options: [
        { text: '边转运边持续评估，一路守住生命体征', effects: { skill: 12, ethics: 8, health: -8, stress: 10 } },
        { text: '按规程指挥现场，分工搬运', label: '团队协作', effects: { network: 10, skill: 6, legalRisk: -5, stress: 6 } }
      ]
    },
    {
      id: 're_rs_media_interview',
      stage: 'resident',
      title: '🎲 记者想采访你',
      text: '一起纠纷上了本地热搜，记者希望“一线医生谈谈真实情况”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'complaint_case',
      options: [
        { text: '按流程转给宣传科，不擅自发声', label: '稳妥', effects: { legalRisk: -10, network: 5, ethics: 4, stress: 3 } },
        { text: '匿名接受采访，说出行业的难处', effects: { network: 8, ethics: 6, legalRisk: 12, stress: 10 } },
        { text: '拒绝一切采访，闭口不谈', effects: { stress: 5, legalRisk: -3, network: -4 } }
      ]
    },
    {
      id: 're_rs_security_drill',
      stage: 'resident',
      title: '🎲 一次真实的安保警报',
      text: '门诊大厅传来争吵和推搡声，一次性防护和一键报警装置就在你手边。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'complaint_case',
      options: [
        { text: '按预案撤离并报警，保护同事与患者', label: '稳妥', effects: { ethics: 10, legalRisk: -8, network: 8, stress: 10 } },
        { text: '冲上去讲道理', effects: { health: -12, ethics: 6, stress: 14, legalRisk: 5 } }
      ]
    },
    {
      id: 're_romance_resident',
      stage: 'resident',
      title: '🎲 相亲角的邀约',
      text: '亲戚安排的相亲对象条件不错，据说也理解医生的作息。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'ward_rounds',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        {
          text: '认真接触，看看能否长久',
          check: {
            baseChance: 62,
            stats: { stress: -0.3, network: 0.25, ethics: 0.2, money: 0.1 },
            minChance: 26,
            maxChance: 88,
            success: {
              effects: { stress: -12, health: 6 },
              flagsSet: ['has_partner'],
              delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '有个理解你作息的人，日子多了一点盼头。' }],
              feedback: '对方理解医生的辛苦，你们稳稳走到了一起。',
              log: '💞 你通过相亲开启了一段稳定关系。'
            },
            failure: { effects: { stress: 5 }, feedback: '聊得来，但节奏对不上，这次没成。', log: '合适的人，也要合适的时间。' }
          }
        },
        { text: '暂时不想将就', label: '长期主义', effects: { stress: 3, ethics: 5, health: 3 } }
      ]
    },
    {
      id: 're_relationship_nightshift',
      stage: 'resident',
      title: '🎲 又一次爽约',
      text: '说好的纪念日晚餐，你又因为一台急诊放了 TA 鸽子。',
      rarity: 'common',
      weight: 6,
      returnTo: 'patient_talk',
      requireFlags: ['has_partner'],
      options: [
        { text: '事后真诚补偿，坦白医生的身不由己', effects: { stress: -8, ethics: 6, money: -8, health: 3 } },
        { text: '把下个月的排班表提前发给 TA', label: '团队协作', effects: { stress: -5, ethics: 5, network: 3 } },
        {
          text: '习惯性地说“下次一定”',
          effects: { stress: 10, ethics: -5 },
          delayed: [{ turns: 2, effects: { stress: 8 }, log: 'TA 终于说出了“我们是不是不合适”。' }]
        }
      ]
    },
    {
      id: 're_relationship_house',
      stage: 'resident',
      title: '🎲 首付的谈判桌',
      text: '到了谈婚论嫁的阶段，两个家庭都在看你们的“诚意”。',
      rarity: 'uncommon',
      weight: 5,
      returnTo: 'performance_review',
      requireFlags: ['has_partner'],
      forbidFlags: ['married'],
      options: [
        { text: '掏空积蓄付首付，扛起房贷', effects: { money: -25, stress: 12, network: 6, health: -3 } },
        { text: '坦诚沟通，先租房过渡', label: '稳妥', effects: { stress: -6, ethics: 6, money: -5, health: 3 } },
        { text: '两家人坐下来一起算账做规划', label: '团队协作', effects: { network: 8, money: -12, stress: -3, ethics: 4 } }
      ]
    },
    {
      id: 're_marriage_resident',
      stage: 'resident',
      title: '🎲 婚礼提上日程',
      text: '拖了又拖，你们决定不再等一个“不忙”的时机。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'ward_rounds',
      requireFlags: ['has_partner'],
      forbidFlags: ['married'],
      options: [
        {
          text: '办一场简单而温暖的婚礼',
          effects: { stress: -12, health: 6, money: -16, network: 10 },
          flagsSet: ['married'],
          delayed: [{ turns: 2, effects: { stress: -6, health: 4 }, log: '婚后有人替你分担生活，压力慢了下来。' }]
        },
        { text: '裸婚，先领证一切从简', label: '稳妥', effects: { stress: -6, money: -3, ethics: 5, health: 3 }, flagsSet: ['married'] }
      ]
    },
    {
      id: 're_child_choice',
      stage: 'resident',
      title: '🎲 要不要孩子',
      text: '婚后绕不开的话题摆上台面：在医生这个职业里，养孩子谈何容易。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'performance_review',
      requireFlags: ['married'],
      forbidFlags: ['has_child', 'dink'],
      options: [
        {
          text: '迎接新生命，成为父母',
          effects: { stress: 10, health: -6, money: -18, ethics: 8 },
          flagsSet: ['has_child'],
          delayed: [{ turns: 3, effects: { stress: 8, money: -10 }, log: '孩子半夜发烧，你在值班和奶粉钱之间连轴转。' }]
        },
        { text: '慎重考虑，先把事业站稳', label: '长期主义', effects: { skill: 8, stress: 5 } },
        { text: '和伴侣商定丁克', effects: { stress: -10, health: 6, money: 10 }, flagsSet: ['dink'] }
      ]
    },
    {
      id: 're_rs_partner_career',
      stage: 'resident',
      title: '🎲 伴侣拿到了外地的机会',
      text: 'TA 说：“我可以不去。”但你看得出这句话有多难说出口。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'performance_review',
      requireFlags: ['has_partner'],
      options: [
        { text: '支持 TA 去，两人一起规划异地方案', label: '团队协作', effects: { ethics: 10, stress: 6, network: 5, money: -6 } },
        { text: '自己考虑申请调动，跟着一起走', effects: { network: -8, stress: 8, ethics: 8, skill: -3 } },
        { text: '劝 TA 留下，稳定最重要', label: '稳妥', effects: { stress: -4, ethics: -5, health: 3 } }
      ]
    },

    {
      id: 're_overseas_conf',
      stage: 'senior',
      title: '🎲 国际会议的口头汇报',
      text: '你的摘要被大会接收，可以去做一次十分钟的英文汇报。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'research_track',
      options: [
        { text: '认真准备，借机拓展国际人脉', effects: { research: 12, network: 12, money: -12, stress: 6 } },
        { text: '线上汇报，省时省钱', label: '稳妥', effects: { research: 6, money: 3, stress: -3 } },
        { text: '让学生代替你去，带他见世面', label: '团队协作', effects: { network: 8, ethics: 8, research: 4, money: -8 } }
      ]
    },
    {
      id: 're_patient_banner',
      stage: 'senior',
      title: '🎲 一面迟到的锦旗',
      text: '多年前你救治的患者带着家人回来道谢，锦旗上的字有点歪。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'grassroots_track',
      options: [
        { text: '这一刻，觉得一切都值了', effects: { ethics: 12, stress: -16, health: 8 }, flagsSet: ['patient_recognized'] },
        { text: '谦逊收下，继续出诊', effects: { ethics: 6, stress: -6, skill: 3 } }
      ]
    },
    {
      id: 're_rare_case',
      stage: 'senior',
      title: '🎲 教科书级罕见病例',
      text: '门诊来了一个诊断难度极高的患者，也是绝佳的教学与学术素材。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'promotion_gate',
      options: [
        { text: '组织多学科会诊，一查到底', label: '团队协作', effects: { skill: 14, network: 10, research: 8, stress: 8 } },
        { text: '转诊上级中心，稳妥为先', label: '稳妥', effects: { legalRisk: -8, ethics: 5, stress: -3 } },
        { text: '自己啃下来，顺便写成个案报道', label: '激进', effects: { skill: 10, research: 10, stress: 12, health: -6, legalRisk: 5 } }
      ]
    },
    {
      id: 're_academic_viral',
      stage: 'senior',
      title: '🎲 你的科普突然爆火',
      text: '一条随手拍的科普视频冲上热榜，粉丝一夜暴涨。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'research_track',
      options: [
        { text: '严谨做号，坚持循证科普', label: '长期主义', effects: { network: 14, ethics: 8, money: 8, stress: 6 } },
        { text: '接广告变现，注意合规边界', effects: { money: 20, legalRisk: 12, ethics: -8, stress: 6 } },
        { text: '关掉评论，回归临床', label: '休息', effects: { stress: -10, health: 8 } }
      ]
    },
    {
      id: 're_teaching_students',
      stage: 'senior',
      title: '🎲 带一群规培生',
      text: '科室把新一届规培生交给你带，他们青涩、廉价，又充满干劲。',
      rarity: 'common',
      weight: 8,
      returnTo: 'senior_outcome',
      options: [
        { text: '倾囊相授，做他们的引路人', label: '长期主义', effects: { ethics: 12, network: 10, skill: 6, stress: 5 } },
        { text: '按规矩带，不多不少', effects: { skill: 5, stress: 2 } },
        { text: '建立带教手册，让经验能复制', label: '团队协作', effects: { network: 8, skill: 8, ethics: 6, stress: 6 } }
      ]
    },
    {
      id: 're_sr_grant_review',
      stage: 'senior',
      title: '🎲 你成了评审专家',
      text: '待评的本子里，有一份来自你熟悉的团队。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'grant_revision',
      options: [
        { text: '主动申请回避', label: '稳妥', effects: { ethics: 14, legalRisk: -10, network: -4, stress: 3 } },
        { text: '按标准严格打分，公私分明', label: '均衡', effects: { ethics: 10, research: 5, network: -3, stress: 5 } },
        { text: '手下留情，人情总要还', effects: { network: 10, ethics: -12, legalRisk: 12 } }
      ]
    },
    {
      id: 're_sr_student_fraud',
      stage: 'senior',
      title: '🎲 学生的数据有问题',
      text: '你翻看原始记录，发现三组数据的时间戳完全一致。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'research_track',
      options: [
        { text: '要求撤稿并重做，承担导师责任', label: '稳妥', effects: { ethics: 16, legalRisk: -12, research: -6, stress: 12 } },
        { text: '内部处理，让他悄悄改回来', effects: { research: 3, ethics: -8, legalRisk: 10, stress: 8 } },
        { text: '当没看见，反正署名在后面', effects: { ethics: -14, legalRisk: 14, stress: 6 } }
      ]
    },
    {
      id: 're_sr_hospital_merge',
      stage: 'senior',
      title: '🎲 医院合并与新院区',
      text: '通知下来：你的科室要整体搬去 30 公里外的新院区。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'promotion_gate',
      options: [
        { text: '主动参与筹建，抢占新平台机会', label: '激进', effects: { network: 12, skill: 6, money: 6, stress: 10, health: -6 } },
        { text: '申请留在老院区，稳住生活半径', label: '稳妥', effects: { health: 8, stress: -6, network: -6 } },
        { text: '和同事一起争取通勤与排班保障', label: '团队协作', effects: { network: 10, ethics: 6, stress: -3 } }
      ]
    },
    {
      id: 're_sr_headhunter',
      stage: 'senior',
      title: '🎲 民营医院来挖角',
      text: '开价是你现在收入的三倍，附加条件是“带患者资源过来”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'private_track',
      options: [
        { text: '拒绝带资源的条件，只谈专业与规范', label: '稳妥', effects: { ethics: 12, legalRisk: -8, money: 5, stress: 4 } },
        { text: '接受高薪，按对方要求操作', effects: { money: 25, ethics: -12, legalRisk: 14, stress: 8 } },
        { text: '留在公立，把这次谈判当筹码', label: '均衡', effects: { network: 8, money: 8, stress: 5 } }
      ]
    },
    {
      id: 're_sr_health_alarm',
      stage: 'senior',
      title: '🎲 一次胸痛的深夜',
      text: '你自己做了个心电图，然后在办公室坐了很久。',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'senior_outcome',
      options: [
        { text: '立刻住院检查，把工作全部交接出去', label: '休息', effects: { health: 16, stress: -12, money: -14, network: -4 } },
        { text: '开点药，减少夜班就好', label: '均衡', effects: { health: 6, stress: -5, skill: -2 } },
        { text: '什么也没说，第二天照常上班', effects: { health: -16, stress: 12 } }
      ]
    },
    {
      id: 're_sr_policy_change',
      stage: 'senior',
      title: '🎲 支付政策又调整了',
      text: '新的病组分值和考核口径下来了，全科室都在重新学怎么写病历。',
      rarity: 'common',
      weight: 8,
      returnTo: 'grassroots_track',
      options: [
        { text: '带头研读政策，做一次科内培训', label: '团队协作', effects: { network: 12, skill: 8, legalRisk: -8, stress: 6 } },
        { text: '等别人弄明白了再跟着做', effects: { stress: -4, skill: 2, money: -5 } },
        { text: '钻空子找高分值路径', effects: { money: 14, ethics: -10, legalRisk: 14 } }
      ]
    },
    {
      id: 're_sr_livestream',
      stage: 'senior',
      title: '🎲 电视台的健康栏目',
      text: '导演希望你讲得“再通俗一点、再夸张一点”。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'alt_career_track',
      options: [
        { text: '坚持事实边界，宁可无聊也不夸大', label: '稳妥', effects: { ethics: 12, network: 6, legalRisk: -6, money: 4 } },
        { text: '按导演要求加戏，效果确实炸裂', effects: { network: 12, money: 10, ethics: -10, legalRisk: 10 } }
      ]
    },
    {
      id: 're_sr_dept_faction',
      stage: 'senior',
      title: '🎲 科室里的两派',
      text: '两位副主任互不买账，中间的人都被要求“表个态”。',
      rarity: 'common',
      weight: 8,
      returnTo: 'chief_competition',
      options: [
        { text: '不站队，把精力放在患者和教学上', label: '长期主义', effects: { ethics: 10, skill: 8, network: -5, stress: 6 } },
        { text: '选择更有胜算的一边', label: '激进', effects: { network: 12, ethics: -8, stress: 8, legalRisk: 4 } },
        { text: '推动建立以数据说话的评价机制', label: '团队协作', effects: { network: 8, skill: 6, ethics: 8, stress: 8 } }
      ]
    },
    {
      id: 're_sr_alumni_reunion',
      stage: 'senior',
      title: '🎲 毕业二十年同学会',
      text: '当年一起背解剖的同学，如今有主任、有药企总监、有开餐馆的。',
      rarity: 'common',
      weight: 7,
      returnTo: 'senior_outcome',
      options: [
        { text: '真诚交流，反而收获了合作机会', label: '团队协作', effects: { network: 12, money: 5, stress: -8, health: 4 } },
        { text: '比着比着，回家一夜没睡好', effects: { stress: 12, health: -5, money: -6 } }
      ]
    },
    {
      id: 're_sr_retirement_plan',
      stage: 'senior',
      title: '🎲 认真算一次退休账',
      text: '你第一次打开养老金测算页面，也第一次认真想“之后做什么”。',
      rarity: 'common',
      weight: 7,
      returnTo: 'senior_outcome',
      options: [
        { text: '做长期规划，稳健配置并培养爱好', label: '长期主义', effects: { money: 12, health: 8, stress: -10 } },
        { text: '被高收益产品打动，投了一大笔', label: '激进', effects: { money: -18, stress: 10, legalRisk: 4 } },
        { text: '不想这些，继续埋头工作', effects: { skill: 5, stress: 6, health: -5 } }
      ]
    },
    {
      id: 're_sr_textbook',
      stage: 'senior',
      title: '🎲 参与教材编写',
      text: '出版社邀请你负责其中两章，稿费很少，署名很靠后。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'research_track',
      options: [
        { text: '认真写，留下能被翻很多年的文字', label: '长期主义', effects: { research: 10, ethics: 10, network: 8, stress: 8, health: -4 } },
        { text: '婉拒，时间留给临床和家人', label: '稳妥', effects: { health: 8, stress: -8, network: -3 } }
      ]
    },
    {
      id: 're_sr_young_quit',
      stage: 'senior',
      title: '🎲 年轻医生递了辞职信',
      text: '“老师，我不是不喜欢这份工作，我只是活不下去。”',
      rarity: 'uncommon',
      weight: 7,
      returnTo: 'senior_outcome',
      options: [
        { text: '认真听完，帮他争取排班与待遇改善', label: '团队协作', effects: { ethics: 12, network: 10, stress: 8 } },
        { text: '尊重并推荐他去更适合的岗位', effects: { ethics: 10, network: 6, stress: 3 } },
        { text: '劝他“再忍两年就好了”', effects: { ethics: -6, stress: 6, network: -5 } }
      ]
    },
    {
      id: 're_sr_award',
      stage: 'senior',
      title: '🎲 一个行业奖项',
      text: '你被提名了，公示名单里还有几位你尊敬的同行。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'talent_program',
      options: [
        { text: '如实提交材料，成不成看评审', label: '稳妥', effects: { research: 8, network: 6, ethics: 8, stress: 4 } },
        { text: '四处打招呼争取票数', effects: { network: 12, ethics: -8, legalRisk: 8, stress: 6 } },
        { text: '把名额让给更需要的年轻同事', label: '长期主义', effects: { ethics: 14, network: 10, stress: -5 } }
      ]
    },
    {
      id: 're_dink_choice',
      stage: 'senior',
      title: '🎲 关于丁克的共识',
      text: '事业进入正轨，你们再次认真讨论了“两个人的生活”。',
      rarity: 'common',
      weight: 5,
      returnTo: 'grassroots_track',
      requireFlags: ['married'],
      forbidFlags: ['has_child', 'dink'],
      options: [
        { text: '坚定丁克，把资源留给彼此和事业', label: '长期主义', effects: { stress: -10, health: 8, money: 14, research: 5 }, flagsSet: ['dink'] },
        { text: '再想想，留一个开放的可能', effects: { stress: 4, health: 3 } }
      ]
    },
    {
      id: 're_childcare_cost',
      stage: 'senior',
      title: '🎲 学区房与补习班',
      text: '孩子到了上学的年纪，教育开销像一台新的碎钞机。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'grassroots_track',
      requireFlags: ['has_child'],
      options: [
        { text: '拼一把，给孩子更好的资源', effects: { money: -25, stress: 12, health: -5 } },
        { text: '量力而行，重视陪伴而非砸钱', label: '均衡', effects: { money: -10, ethics: 8, stress: -5, health: 5 } },
        { text: '和伴侣分工，一人管学习一人管接送', label: '团队协作', effects: { money: -14, network: 5, stress: -3, ethics: 5 } }
      ]
    },
    {
      id: 're_sr_child_medicine',
      stage: 'senior',
      title: '🎲 孩子说想学医',
      text: '饭桌上他说出这句话时，你握筷子的手停了一下。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'senior_outcome',
      requireFlags: ['has_child'],
      options: [
        { text: '把真实的辛苦和意义都讲给他听', label: '均衡', effects: { ethics: 12, stress: -6, network: 4, health: 3 } },
        { text: '坚决劝退：“换个专业吧。”', effects: { stress: 8, ethics: -6, health: -3 } },
        { text: '带他去科室待一天，让他自己看', label: '长期主义', effects: { ethics: 10, network: 6, stress: -4 } }
      ]
    },
    {
      id: 're_sr_marriage_crisis',
      stage: 'senior',
      title: '🎲 客厅里的沉默',
      text: '你们已经很久没有一起吃过晚饭，连吵架都懒得吵了。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'senior_outcome',
      requireFlags: ['married'],
      options: [
        { text: '一起去做婚姻咨询，认真修补', label: '团队协作', effects: { stress: -12, health: 8, money: -10, ethics: 8 } },
        { text: '主动减少加班，把周末还给家庭', label: '休息', effects: { stress: -10, health: 10, skill: -4, money: -5 } },
        { text: '继续用工作填满所有缝隙', effects: { skill: 8, money: 6, stress: 14, health: -8, ethics: -6 } }
      ]
    },
    {
      id: 're_sr_single_peace',
      stage: 'senior',
      title: '🎲 一个人的周末',
      text: '你煮了咖啡，看完一部长电影，没有任何人需要你解释行程。',
      rarity: 'common',
      weight: 5,
      returnTo: 'senior_outcome',
      requireFlags: ['single_choice'],
      options: [
        { text: '享受这种自洽，并把它维持下去', label: '长期主义', effects: { stress: -12, health: 10, money: 6 } },
        { text: '还是给老朋友打了个电话', label: '团队协作', effects: { network: 10, stress: -8, health: 4 } }
      ]
    }
  ];

  // ===== 主线事件 =====
  const events = [
    {
      id: 'gaokao_choice',
      stage: 'gaokao',
      major: true,
      title: '高考出分夜',
      text: '家庭群像抢救室一样反复刷新页面。分数够上一本，但离“稳上顶流医学院”还差一口气。你有四条路摆在面前。',
      yearDelta: 1,
      options: [
        {
          text: '稳妥填报：本省重点院校临床医学（5+3）',
          label: '稳妥',
          safeChoice: true,
          effects: { stress: 6, money: -3, ethics: 6 },
          check: {
            baseChance: 75,
            stats: { ethics: 0.2, health: 0.12, stress: -0.25, skill: 0.15 },
            minChance: 55,
            maxChance: 92,
            success: {
              target: 'major_confirm',
              effects: { ethics: 8, skill: 8, stress: -6 },
              feedback: '志愿踏实落地，你顺利进入医学主线，心态也稳。',
              log: '判定成功（志愿）：稳妥填报让你踏实进入医学主线。'
            },
            failure: {
              target: 'major_confirm',
              effects: { stress: 8, skill: 4 },
              feedback: '录取名次略低于预期，但你仍进入了医学主线，只是起步更紧张。',
              log: '判定失败（志愿）：录取有点波折，你仍进入医学主线，属普通开局。'
            }
          }
        },
        {
          text: '均衡填报：省外医科大学 + 服从调剂',
          label: '均衡',
          effects: { stress: 4, skill: 4, network: 4 },
          check: {
            baseChance: 62,
            stats: { skill: 0.3, network: 0.2, stress: -0.2, health: 0.1 },
            minChance: 30,
            maxChance: 90,
            success: {
              target: 'major_confirm',
              effects: { skill: 8, network: 8, money: 4 },
              feedback: '你去了一所培养扎实的医科大学，附属医院资源不错。',
              log: '判定成功（志愿）：你稳稳进入一所培养扎实的医科大学。'
            },
            failure: {
              target: 'major_confirm',
              effects: { stress: 10, skill: 3, network: -4 },
              feedback: '被调剂到了不太熟悉的方向，你需要花更多力气追上来。',
              log: '判定失败（志愿）：服从调剂让你落到了非首选专业。'
            }
          }
        },
        {
          text: '冲刺顶尖名校临床（滑档风险高）',
          label: '激进',
          riskyChoice: true,
          effects: { stress: 12, money: -4, skill: 6 },
          check: {
            baseChance: 34,
            stats: { skill: 0.5, network: 0.25, stress: -0.3, health: 0.1 },
            minChance: 12,
            maxChance: 72,
            success: {
              target: 'major_confirm',
              effects: { skill: 14, network: 12, ethics: 6, stress: -4 },
              feedback: '你压线冲进了顶级平台，起点直接拉满。',
              log: '判定成功（志愿）：你冲进了顶尖名校临床，开局平台极高。'
            },
            failure: {
              target: 'major_confirm',
              effects: { stress: 16, health: -8, money: -5, skill: 3 },
              feedback: '志愿滑档到冷门院校，你只能带着不甘继续。',
              log: '判定失败（志愿）：冲高失败滑档，你以更被动的姿态进入医学主线。'
            }
          }
        },
        {
          text: '听劝改报计算机，彻底退出医疗线',
          effects: { health: 12, stress: -22, money: 18 },
          target: 'ending_tech_escape'
        }
      ]
    },
    {
      id: 'major_confirm',
      stage: 'gaokao',
      title: '填志愿最后 5 分钟',
      text: '“劝人学医，天打雷劈”的表情包在群里刷屏。你的手指悬在提交按钮上方，心跳比模考还快。',
      yearDelta: 0,
      options: [
        {
          text: '坚持临床医学，签下漫长主线',
          label: '长期主义',
          target: 'admission_notice',
          effects: { ethics: 8, stress: 5, skill: 3 },
          flagsSet: ['committed_medicine']
        },
        {
          text: '选影像/检验等相对可控的医学专业',
          label: '均衡',
          target: 'admission_notice',
          effects: { health: 6, stress: -4, skill: 4 },
          flagsSet: ['committed_medicine']
        },
        {
          text: '选生物医学工程，保留转向空间',
          label: '稳妥',
          target: 'admission_notice',
          effects: { research: 8, stress: -2, money: 3 },
          flagsSet: ['bio_background']
        }
      ]
    },
    {
      id: 'admission_notice',
      stage: 'undergrad',
      title: '录取通知书到手',
      text: '烫金的信封被亲戚传阅了一圈。“以后看病靠你了。”你笑着点头，还不知道这句话会跟你多少年。',
      yearDelta: 1,
      options: [
        { text: '提前熟悉课程体系与时间管理', label: '长期主义', target: 'freshman_life', effects: { health: 5, stress: -5, skill: 6 } },
        { text: '加入新生群，认识未来的同班战友', label: '团队协作', target: 'freshman_life', effects: { network: 10, stress: 2, health: 2 } },
        { text: '把最后一个暑假彻底用来休息', label: '休息', target: 'freshman_life', effects: { health: 10, stress: -10, skill: -2 } }
      ]
    },
    {
      id: 'freshman_life',
      stage: 'undergrad',
      title: '大一适应期',
      text: '课表像拼图：早八、晚课、自习室排队。你需要在一个学期内建立自己的生存节奏。',
      yearDelta: 1,
      options: [
        { text: '规律作息，稳扎稳打', label: '稳妥', target: 'anatomy_lab', effects: { health: 10, stress: -6, skill: 5 } },
        { text: '白天上课，晚上社团连轴转', label: '激进', target: 'anatomy_lab', effects: { network: 12, stress: 8, health: -6, skill: 3 } },
        { text: '疯狂刷绩点争奖学金', target: 'anatomy_lab', effects: { skill: 10, money: 8, stress: 10, health: -5 } }
      ]
    },
    {
      id: 'anatomy_lab',
      stage: 'undergrad',
      title: '解剖课第一天',
      text: '手套、器械、福尔马林的气味，以及一整间的沉默。你第一次直面“医学不是 PPT”。',
      yearDelta: 1,
      options: [
        { text: '认真练习并整理系统笔记', label: '长期主义', target: 'biochem_week', effects: { skill: 10, ethics: 5, stress: 4 } },
        { text: '和小组配合分工，互相考核', label: '团队协作', target: 'biochem_week', effects: { skill: 6, network: 8, stress: 2 } },
        { text: '课后打工缓解生活费压力', target: 'biochem_week', effects: { money: 12, health: -6, stress: 5, skill: 2 } }
      ]
    },
    {
      id: 'biochem_week',
      stage: 'undergrad',
      title: '生化考试周',
      text: '代谢通路背到梦里还在循环。咖啡与功能饮料成了你身体的第九大系统。',
      yearDelta: 1,
      options: [
        { text: '组队复习，互相抽背', label: '团队协作', target: 'clerkship_intro', effects: { skill: 8, network: 6, stress: 3 } },
        { text: '单刷到凌晨，冲绝对高分', label: '激进', target: 'clerkship_intro', effects: { skill: 12, health: -10, stress: 10 } },
        { text: '抓重点保及格，把时间留给临床技能', label: '均衡', target: 'clerkship_intro', effects: { skill: 5, health: 5, stress: -4 } }
      ]
    },
    {
      id: 'clerkship_intro',
      stage: 'undergrad',
      title: '首次见习',
      text: '老师说：“先学会看、听、记，再谈操作。”你第一次真正接触病区的节奏和气味。',
      yearDelta: 1,
      options: [
        { text: '主动请教老师与住院医', label: '激进', target: 'campus_meme_night', effects: { skill: 10, network: 6, stress: 4 } },
        { text: '安静观察并做详细记录', label: '稳妥', target: 'campus_meme_night', effects: { skill: 8, ethics: 5, legalRisk: -3, stress: -2 } },
        { text: '只打卡不深究，把精力留给考试', target: 'campus_meme_night', effects: { stress: -5, skill: 2, ethics: -3 } }
      ]
    },
    {
      id: 'campus_meme_night',
      stage: 'undergrad',
      title: '值班群梗图之夜',
      text: '群里刷着“这个病人你收一下”“下班前最后一个会诊”。笑完之后，你意识到这可能就是你的未来日常。',
      yearDelta: 0,
      options: [
        { text: '当段子看，笑完继续背书', label: '休息', target: 'mentor_choice', effects: { stress: -8, health: 5 } },
        { text: '认真记下前辈的避坑经验', label: '长期主义', target: 'mentor_choice', effects: { skill: 6, legalRisk: -5, ethics: 4 } },
        { text: '开始认真评估要不要继续走下去', label: '均衡', target: 'mentor_choice', effects: { stress: 5, skill: 4, ethics: -2, health: 2 } }
      ]
    },
    {
      id: 'mentor_choice',
      stage: 'undergrad',
      major: true,
      title: '考研 / 保研 / 就业分流前夜',
      text: '临床深耕、科研导向，还是先就业先赚钱？辅导员说：“想清楚，这一步会决定你未来十年的节奏。”',
      yearDelta: 1,
      options: [
        {
          text: '冲考研：目标三甲平台，全力一搏',
          label: '激进',
          target: 'entrance_exam_prep',
          effects: { stress: 12, skill: 10, research: 5, health: -4 },
          flagsSet: ['postgrad_track']
        },
        {
          text: '争取保研：提前进实验室积累成果',
          label: '长期主义',
          target: 'recommendation_panel',
          effects: { research: 12, network: 8, stress: 8 },
          flagsSet: ['postgrad_track']
        },
        {
          text: '和同学组建备考互助小组',
          label: '团队协作',
          target: 'entrance_exam_prep',
          effects: { network: 10, skill: 8, stress: -4 },
          flagsSet: ['postgrad_track']
        },
        {
          text: '稳妥就业：先考执医再进规培',
          label: '稳妥',
          safeChoice: true,
          effects: { money: 8, skill: 6, stress: 3 },
          flagsSet: ['direct_training'],
          check: {
            baseChance: 78,
            stats: { health: 0.12, ethics: 0.15, stress: -0.25, skill: 0.2 },
            minChance: 55,
            maxChance: 92,
            success: {
              target: 'license_exam_prep',
              effects: { skill: 10, money: 6, stress: -5 },
              feedback: '你早早锁定就业路线，节奏稳、目标清晰。',
              log: '判定成功（分流）：稳妥就业路线让你提前进入执医与规培节奏。'
            },
            failure: {
              target: 'license_exam_prep',
              effects: { stress: 8, skill: 4, money: -3 },
              feedback: '求职信息有点乱，但你仍走上了就业与规培的普通路线。',
              log: '判定失败（分流）：就业规划略有波折，你走上普通就业路线。'
            }
          }
        }
      ]
    },
    {
      id: 'recommendation_panel',
      stage: 'graduate',
      major: true,
      title: '保研面试组会',
      text: '推免名额只有三个。老师们会看成绩排名、项目经历、表达能力，以及你被追问时的稳定度。',
      yearDelta: 0,
      options: [
        {
          text: '拿成绩和项目正面争取推免名额',
          label: '均衡',
          effects: { stress: 5, research: 3 },
          check: {
            baseChance: 54,
            stats: { research: 0.45, skill: 0.3, network: 0.2, stress: -0.2, ethics: 0.15 },
            minChance: 22,
            maxChance: 88,
            success: {
              target: 'grad_admission',
              effects: { network: 6, research: 6, stress: -5 },
              feedback: '老师认可了你的积累，你顺利拿到推免资格。',
              log: '判定成功（保研）：老师认可了你的成绩和项目，你顺利拿到推免资格。'
            },
            failure: {
              target: 'entrance_exam_prep',
              effects: { stress: 8, health: -4 },
              feedback: '名额被更强的同学拿走，你只能立刻转入统考冲刺。',
              log: '判定失败（保研）：推免名额旁落，你只能临时切回统考战场。'
            }
          }
        },
        {
          text: '提前联系意向导师，争取推荐与内推',
          label: '团队协作',
          effects: { network: 8, stress: 4, money: -3 },
          check: {
            baseChance: 56,
            stats: { network: 0.45, research: 0.25, ethics: 0.2, stress: -0.15 },
            minChance: 22,
            maxChance: 86,
            success: {
              target: 'grad_admission',
              effects: { network: 10, research: 4, stress: -4 },
              feedback: '导师提前记住了你，面试时的问题也都在准备范围内。',
              log: '判定成功（保研）：导师的支持帮你锁定了名额。'
            },
            failure: {
              target: 'entrance_exam_prep',
              effects: { stress: 6, network: 4 },
              feedback: '导师很客气，但名额并不由他一个人决定。',
              log: '判定失败（保研）：人情帮不上最后一票，你转向统考。'
            }
          }
        },
        {
          text: '不等结果了，现在就全力准备统考',
          label: '稳妥',
          safeChoice: true,
          target: 'entrance_exam_prep',
          effects: { skill: 12, stress: 6, research: -2 }
        }
      ]
    },
    {
      id: 'entrance_exam_prep',
      stage: 'graduate',
      major: true,
      title: '考研冲刺',
      text: '图书馆座位像春运抢票。你和同学比谁先背完那本厚得能当枕头的内科学。',
      yearDelta: 1,
      options: [
        {
          text: '系统复盘，按计划稳步推进',
          label: '均衡',
          effects: { skill: 8, stress: 5, health: -3 },
          check: {
            baseChance: 56,
            stats: { skill: 0.5, research: 0.2, health: 0.15, stress: -0.3 },
            minChance: 22,
            maxChance: 90,
            success: {
              target: 'grad_admission',
              effects: { stress: -6, skill: 6 },
              feedback: '你顺利过线并拿到拟录取。',
              log: '判定成功（考研）：你顺利过线并拿到目标院校拟录取。'
            },
            failure: {
              target: 'grad_waiting_year',
              effects: { stress: 10, health: -4 },
              feedback: '分数差了一口气，只能考虑调剂、二战或转向就业。',
              log: '判定失败（考研）：你与目标院校擦肩而过，只能进入补救路线。'
            }
          }
        },
        {
          text: '极限熬夜，把命押在上岸上',
          label: '激进',
          riskyChoice: true,
          effects: { skill: 10, stress: 10, health: -10 },
          check: {
            baseChance: 48,
            stats: { skill: 0.6, health: 0.15, stress: -0.5, research: 0.15 },
            minChance: 15,
            maxChance: 88,
            success: {
              target: 'grad_admission',
              effects: { skill: 8, stress: -4, research: 4 },
              feedback: '你硬是把自己卷进了上岸名单，分数还相当漂亮。',
              log: '判定成功（考研）：你靠极限冲刺挤进了上岸名单。'
            },
            failure: {
              target: 'grad_waiting_year',
              effects: { stress: 14, health: -8 },
              feedback: '身体和心态先扛不住了，结果也没能稳住。',
              log: '判定失败（考研）：高压备考反噬，你不得不接受失利。'
            }
          }
        },
        {
          text: '加入学习小组，和前辈交换经验与资料',
          label: '团队协作',
          effects: { network: 8, stress: 2, money: -4 },
          check: {
            baseChance: 54,
            stats: { network: 0.4, skill: 0.35, stress: -0.25, ethics: 0.1 },
            minChance: 22,
            maxChance: 86,
            success: {
              target: 'grad_admission',
              effects: { stress: -6, network: 6, skill: 4 },
              feedback: '前辈给的方向很准，小组的节奏也拖着你往前走。',
              log: '判定成功（考研）：互助小组帮你卡住了关键分。'
            },
            failure: {
              target: 'grad_waiting_year',
              effects: { stress: 8, network: 4 },
              feedback: '经验可以借，分数终究要自己考出来。',
              log: '判定失败（考研）：你还是差了临门一脚。'
            }
          }
        },
        {
          text: '稳妥求稳：接受调剂志愿，先保住上岸路线',
          label: '稳妥',
          safeChoice: true,
          target: 'grad_waiting_year',
          effects: { stress: -8, health: 6, skill: 5 }
        }
      ]
    },
    {
      id: 'grad_waiting_year',
      stage: 'graduate',
      title: '上岸失之交臂后',
      text: '调剂系统、二战群、招聘会同时向你招手。你必须在两周内重新规划人生。',
      yearDelta: 1,
      options: [
        { text: '接受调剂，先读临床专硕', label: '稳妥', target: 'grad_admission', effects: { skill: 6, research: 4, stress: 3 } },
        { text: '二战一年，非目标院校不去', label: '激进', target: 'entrance_exam_prep', effects: { stress: 12, skill: 8, money: -12, health: -5 } },
        { text: '放弃继续读研，直接转执医与规培', label: '均衡', target: 'license_exam_prep', effects: { money: 8, skill: 6, stress: 2 }, flagsSet: ['direct_training'] }
      ]
    },
    {
      id: 'grad_admission',
      stage: 'graduate',
      title: '拟录取通知',
      text: '你上岸了。喜悦还没散去，导师选择焦虑马上接力：选谁，几乎决定了你未来三年的睡眠时长。',
      yearDelta: 0,
      options: [
        { text: '选科研强势导师，冲成果', label: '激进', target: 'lab_entry', effects: { research: 12, stress: 8, health: -4 }, flagsSet: ['strong_pi'] },
        { text: '选临床教学平衡型导师', label: '均衡', target: 'lab_entry', effects: { skill: 8, network: 6, stress: 3 } },
        { text: '选“放养型”导师，自己安排节奏', label: '稳妥', target: 'lab_entry', effects: { health: 8, research: 4, stress: -5, network: -3 } }
      ]
    },
    {
      id: 'lab_entry',
      stage: 'graduate',
      title: '研究生第一学期',
      text: '白天跟门诊，晚上跑实验和读文献，时间被切成不规则的碎片。',
      yearDelta: 1,
      options: [
        { text: '主攻实验，先把课题推起来', label: '激进', target: 'experiment_failure', effects: { research: 12, stress: 8, health: -6 } },
        { text: '临床科研两手抓', label: '均衡', target: 'experiment_failure', effects: { skill: 7, research: 7, stress: 6, health: -3 } },
        { text: '融入课题组，先把人和流程摸熟', label: '团队协作', target: 'experiment_failure', effects: { network: 10, research: 5, stress: 2 } }
      ]
    },
    {
      id: 'experiment_failure',
      stage: 'graduate',
      title: '实验重复失败',
      text: '第 6 次重复后，结果依然像在和你开玩笑。距离组会还有四天。',
      yearDelta: 1,
      options: [
        {
          text: '复盘全流程，请统计与技术老师一起看',
          label: '团队协作',
          effects: { research: 6, network: 5, stress: 4 },
          retry: {
            maxAttempts: 3,
            yearCostPerRetry: 1,
            costPerRetry: { stress: 8, money: -4 },
            bonusPerRetry: 12,
            alternativeTarget: 'project_delay'
          },
          check: {
            baseChance: 58,
            stats: { research: 0.5, network: 0.3, ethics: 0.15, stress: -0.3 },
            minChance: 22,
            maxChance: 90,
            success: {
              target: 'paper_deadline',
              effects: { research: 12, stress: -6, skill: 4 },
              feedback: '你终于找到了关键问题，课题重新转了起来。',
              log: '判定成功（实验）：你在外援帮助下找到了实验卡点。'
            },
            failure: {
              target: 'project_delay',
              effects: { stress: 10, health: -5 },
              feedback: '问题比想象中更深，你可以再战一轮，或先接受延期。',
              log: '判定失败（实验）：实验仍然反复失败，你可以再战或接受延期。'
            }
          }
        },
        {
          text: '换一套技术路线，从头验证条件',
          label: '长期主义',
          effects: { research: 5, stress: 6, money: -6 },
          check: {
            baseChance: 46,
            stats: { research: 0.45, skill: 0.25, health: 0.15, stress: -0.3 },
            minChance: 18,
            maxChance: 84,
            success: {
              target: 'paper_deadline',
              effects: { research: 14, skill: 6 },
              feedback: '新路线跑通了，数据比原方案还漂亮。',
              log: '判定成功（实验）：换路线成功，你拿到了更扎实的数据。'
            },
            failure: {
              target: 'project_delay',
              effects: { stress: 10, money: -6, health: -4 },
              feedback: '新路线也没跑通，时间和经费一起烧掉了。',
              log: '判定失败（实验）：换路线失败，课题被迫延期。'
            }
          }
        },
        {
          text: '把数据“修一修”，先把组会糊过去',
          effects: { research: 4, legalRisk: 14, ethics: -14, stress: -4 },
          flagsSet: ['questionable_research'],
          target: 'paper_deadline',
          delayed: [{ turns: 3, effects: { legalRisk: 10, stress: 10 }, log: '导师要求调取原始记录，你的后背开始出汗。' }]
        }
      ]
    },
    {
      id: 'project_delay',
      stage: 'graduate',
      title: '课题延期警报',
      text: '进度会上，导师提醒你：再拖下去，毕业、规培和执医的时间表都会连环错位。',
      yearDelta: 0,
      options: [
        { text: '补做一轮实验，咬牙把数据补齐', label: '激进', target: 'paper_deadline', effects: { research: 8, stress: 8, health: -6, money: -6 } },
        { text: '和导师重排时间表，缩小课题范围', label: '团队协作', target: 'paper_revision_year', effects: { network: 8, research: 4, stress: -5 } },
        { text: '调整目标，先保毕业线和后续执医安排', label: '稳妥', target: 'paper_revision_year', effects: { stress: -4, skill: 5, research: -3 } }
      ]
    },
    {
      id: 'paper_deadline',
      stage: 'graduate',
      title: '论文截止倒计时',
      text: '导师只说了一句“毕业线先过”。你在质量、速度和底线之间反复横跳。',
      yearDelta: 1,
      options: [
        {
          text: '按规范补实验，宁慢勿假',
          label: '长期主义',
          effects: { research: 8, ethics: 6, stress: 6 },
          check: {
            baseChance: 56,
            stats: { research: 0.5, ethics: 0.3, health: 0.1, stress: -0.25 },
            minChance: 22,
            maxChance: 90,
            success: {
              target: 'conference_choice',
              effects: { research: 8, ethics: 5, stress: -5 },
              feedback: '稿件算不上神刊，但每个数据都经得起问。',
              log: '判定成功（论文）：你靠规范和耐心把毕业线稳稳拿下。'
            },
            failure: {
              target: 'paper_revision_year',
              effects: { stress: 8, money: -5 },
              feedback: '审稿意见很重，你需要大修并等待下一轮。',
              log: '判定失败（论文）：稿件被大修，毕业与后续计划都被拖慢。'
            }
          }
        },
        {
          text: '投一本稳妥的期刊，先保住毕业',
          label: '稳妥',
          effects: { research: 4, stress: 2, money: -5 },
          check: {
            baseChance: 74,
            stats: { research: 0.3, skill: 0.15, network: 0.15, stress: -0.2 },
            minChance: 50,
            maxChance: 90,
            success: {
              target: 'conference_choice',
              effects: { research: 5, stress: -4 },
              feedback: '你顺利保住了毕业线，虽然履历不算亮眼。',
              log: '判定成功（论文）：你通过稳妥投稿保住了毕业节奏。'
            },
            failure: {
              target: 'paper_revision_year',
              effects: { stress: 6, money: -4 },
              feedback: '保底并不等于必中，你还是被拖进了返修与等待。',
              log: '判定失败（论文）：连保底方案都没一次过，只能补材料再战。'
            }
          }
        },
        {
          text: '找“模板化写作服务”代劳',
          effects: { research: 3, money: -16, legalRisk: 12, ethics: -12 },
          flagsSet: ['paper_risk'],
          target: 'paper_revision_year',
          delayed: [{ turns: 3, effects: { legalRisk: 14, stress: 10 }, log: '学术诚信抽检触发：你被要求提交全部原始材料。' }]
        }
      ]
    },
    {
      id: 'paper_revision_year',
      stage: 'graduate',
      title: '返修、等待与补救',
      text: '论文没有一次通过。你要决定是继续磨，还是把精力挪到毕业后的赛道上。',
      yearDelta: 0,
      options: [
        { text: '继续返修，把材料补到无可挑剔', label: '长期主义', target: 'conference_choice', effects: { research: 8, ethics: 5, stress: 6, money: -4 } },
        { text: '拉上同门一起改，分工攻审稿意见', label: '团队协作', target: 'conference_choice', effects: { network: 8, research: 5, stress: -3 } },
        { text: '先毕业先转临床，论文以后慢慢补', label: '稳妥', target: 'license_exam_prep', effects: { skill: 8, stress: -4, research: -3 } }
      ]
    },
    {
      id: 'conference_choice',
      stage: 'graduate',
      title: '学术会议机会',
      text: '你拿到一次口头汇报机会。也可以把这笔预算和这几天，全部留给执医备考。',
      yearDelta: 0,
      options: [
        { text: '去参会并主动社交，认识同行', label: '团队协作', target: 'license_exam_prep', effects: { network: 12, research: 6, money: -10 } },
        { text: '线上参会，省钱省时间', label: '均衡', target: 'license_exam_prep', effects: { research: 5, money: 3, stress: -3 } },
        { text: '放弃会议，专心备考执医', label: '稳妥', target: 'license_exam_prep', effects: { skill: 10, stress: 3 } }
      ]
    },
    {
      id: 'license_exam_prep',
      stage: 'training',
      major: true,
      title: '执业医师资格考试备考',
      text: '技能考、笔试、单位盖章、报名材料——每一项都能单独毁掉一个夏天。你必须选一条备考策略。',
      yearDelta: 1,
      options: [
        {
          text: '稳妥备考：按大纲刷题，保证睡眠',
          label: '稳妥',
          safeChoice: true,
          effects: { skill: 8, stress: 4, health: -2 },
          check: {
            baseChance: 78,
            stats: { skill: 0.25, health: 0.15, ethics: 0.1, stress: -0.25 },
            minChance: 55,
            maxChance: 93,
            success: {
              target: 'license_exam_result',
              effects: { skill: 10, stress: -6 },
              feedback: '你按计划完成了备考，考场上没有意外。',
              log: '判定成功（执医）：稳妥备考让你顺利通过考试。'
            },
            failure: {
              target: 'license_retake',
              effects: { stress: 10, health: -4 },
              feedback: '个别科目失手，你与合格线擦肩而过。',
              log: '判定失败（执医）：你以微弱差距落榜，需要重整旗鼓。'
            }
          },
          retry: {
            maxAttempts: 2,
            yearCostPerRetry: 1,
            costPerRetry: { stress: 8, money: -6 },
            bonusPerRetry: 8,
            alternativeTarget: 'license_retake'
          }
        },
        {
          text: '边规培边备考，两头挤时间',
          label: '均衡',
          effects: { skill: 6, money: 8, stress: 8, health: -6 },
          check: {
            baseChance: 58,
            stats: { skill: 0.4, health: 0.2, stress: -0.35, network: 0.1 },
            minChance: 25,
            maxChance: 90,
            success: {
              target: 'license_exam_result',
              effects: { skill: 8, money: 6, stress: -4 },
              feedback: '你在临床里练出来的手感，反而帮了考试的忙。',
              log: '判定成功（执医）：临床与备考互相成就，你一次通过。'
            },
            failure: {
              target: 'license_retake',
              effects: { stress: 12, health: -8, money: 4 },
              feedback: '两头忙的结果是两头都不扎实。',
              log: '判定失败（执医）：白天临床、晚上刷题的策略没能撑住。'
            }
          }
        },
        {
          text: '报高价押题班，赌资料和运气',
          label: '激进',
          riskyChoice: true,
          effects: { money: -22, stress: 6, skill: 5 },
          check: {
            baseChance: 62,
            stats: { skill: 0.3, network: 0.2, stress: -0.3, ethics: -0.1 },
            minChance: 25,
            maxChance: 88,
            success: {
              target: 'license_exam_result',
              effects: { skill: 10, stress: -8 },
              feedback: '押题命中不少，你省下了大量摸索时间。',
              log: '判定成功（执医）：押题班确实押中了重点，你顺利过关。'
            },
            failure: {
              target: 'license_retake',
              effects: { stress: 14, money: -8, ethics: -4 },
              feedback: '钱花完了，题一道没押中，你只能重来。',
              log: '判定失败（执医）：押题班没兑现承诺，钱和时间一起没了。'
            }
          }
        },
        {
          text: '和同期组建打卡小组，互相监督进度',
          label: '团队协作',
          effects: { network: 8, skill: 6, stress: -3 },
          check: {
            baseChance: 68,
            stats: { network: 0.3, skill: 0.3, ethics: 0.1, stress: -0.25 },
            minChance: 40,
            maxChance: 92,
            success: {
              target: 'license_exam_result',
              effects: { network: 8, skill: 8, stress: -5 },
              feedback: '互相盯着的效果，比一个人硬扛强得多。',
              log: '判定成功（执医）：打卡小组把你稳稳推过了合格线。'
            },
            failure: {
              target: 'license_retake',
              effects: { stress: 8, network: 5 },
              feedback: '小组气氛很好，可惜考试只认个人成绩。',
              log: '判定失败（执医）：小组没能替你答题，你还得再来一次。'
            }
          }
        }
      ]
    },
    {
      id: 'license_exam_result',
      stage: 'training',
      title: '成绩查询页面',
      text: '页面转了三圈才刷新出来。“通过”两个字比任何奖状都好看。接下来是选医院、选科室、选未来五年的作息。',
      yearDelta: 0,
      options: [
        { text: '立刻整理简历，冲三甲规培基地', label: '激进', target: 'residency_match', effects: { skill: 6, stress: 6, network: 4 } },
        { text: '先休息几天，再从容投递', label: '休息', target: 'residency_match', effects: { health: 12, stress: -12, money: -4 } },
        { text: '联系师兄师姐，打听各基地真实情况', label: '团队协作', target: 'residency_match', effects: { network: 10, skill: 3, stress: -4 } }
      ]
    },
    {
      id: 'license_retake',
      stage: 'training',
      title: '再来一次',
      text: '差的那几分，会在接下来一年里反复出现在你的梦里。你需要决定用什么姿态重来。',
      yearDelta: 1,
      options: [
        { text: '全脱产备考，一次解决问题', label: '激进', target: 'license_exam_result', effects: { skill: 12, money: -14, stress: 8, health: -4 } },
        { text: '一边做助理岗一边复习', label: '均衡', target: 'license_exam_result', effects: { skill: 7, money: 8, stress: 6, health: -4 } },
        { text: '先进入基层岗位积累，慢慢再考', label: '稳妥', target: 'grassroots_early', effects: { skill: 6, money: 6, health: 5, stress: -5 }, flagsSet: ['grassroots_path'] }
      ]
    },
    {
      id: 'residency_match',
      stage: 'training',
      major: true,
      title: '规培基地选择',
      text: '三甲教学强但压力大，地市医院上手快，基层缺人但成长慢。补贴、住宿、值班频次，每一项都在拉扯你。',
      yearDelta: 1,
      options: [
        {
          text: '稳妥选择地市三甲，兼顾成长与生活',
          label: '稳妥',
          safeChoice: true,
          effects: { health: 6, stress: -4, skill: 6 },
          flagsSet: ['city_hospital_path'],
          check: {
            baseChance: 78,
            stats: { skill: 0.2, ethics: 0.15, health: 0.15, stress: -0.25 },
            minChance: 55,
            maxChance: 92,
            success: {
              target: 'drg_bootcamp',
              effects: { skill: 8, health: 5, money: 6 },
              feedback: '基地节奏合理，带教也愿意教你。',
              log: '判定成功（规培）：你进入节奏合理的地市三甲基地。'
            },
            failure: {
              target: 'residency_waitlist',
              effects: { stress: 8, money: -4 },
              feedback: '名额比预期紧张，你被放进了候补名单。',
              log: '判定失败（规培）：名额紧张，你进入候补流程。'
            }
          }
        },
        {
          text: '冲省会顶级教学医院，接受高强度',
          label: '激进',
          riskyChoice: true,
          effects: { stress: 12, skill: 8, health: -6 },
          flagsSet: ['tier3_path'],
          check: {
            baseChance: 46,
            stats: { skill: 0.45, network: 0.3, research: 0.2, stress: -0.3 },
            minChance: 18,
            maxChance: 86,
            success: {
              target: 'drg_bootcamp',
              effects: { skill: 14, network: 10, research: 6, stress: 5 },
              feedback: '平台确实强，代价是你的睡眠。',
              log: '判定成功（规培）：你挤进了顶级教学医院基地。'
            },
            failure: {
              target: 'residency_waitlist',
              effects: { stress: 12, health: -5, network: 3 },
              feedback: '竞争者太强，你被刷了下来。',
              log: '判定失败（规培）：顶级基地竞争失败，你转入候补。'
            }
          }
        },
        {
          text: '走定向基层协议，换取编制与补贴',
          label: '长期主义',
          target: 'grassroots_early',
          effects: { money: 16, health: 8, stress: -6, skill: 4, network: -3 },
          flagsSet: ['grassroots_path']
        },
        {
          text: '托师兄师姐牵线，找带教口碑好的科室',
          label: '团队协作',
          effects: { network: 8, money: -5, stress: 2 },
          check: {
            baseChance: 64,
            stats: { network: 0.4, ethics: 0.2, skill: 0.2, stress: -0.2 },
            minChance: 30,
            maxChance: 90,
            success: {
              target: 'drg_bootcamp',
              effects: { network: 10, skill: 8, stress: -5 },
              feedback: '你被安排进一个愿意带人的科室，起步顺利。',
              log: '判定成功（规培）：熟人牵线帮你找到了好带教。'
            },
            failure: {
              target: 'residency_waitlist',
              effects: { stress: 6, network: 5 },
              feedback: '人情到位，名额没到位。',
              log: '判定失败（规培）：牵线没能换来名额，你进入候补。'
            }
          }
        }
      ]
    },
    {
      id: 'residency_waitlist',
      stage: 'training',
      title: '候补名单的一个月',
      text: '每天刷新邮箱，等一个不知道会不会来的补录通知。房租不会等你。',
      yearDelta: 0,
      options: [
        { text: '继续等补录，同时打零工维持生活', label: '均衡', target: 'drg_bootcamp', effects: { money: 6, stress: 8, health: -4, skill: 3 } },
        { text: '改投基层岗位，先上岗再说', label: '稳妥', target: 'grassroots_early', effects: { money: 10, health: 5, stress: -6, network: -2 }, flagsSet: ['grassroots_path'] },
        { text: '联系带教老师，争取插入下一批次', label: '团队协作', target: 'drg_bootcamp', effects: { network: 10, money: -5, stress: -3 } }
      ]
    },
    {
      id: 'grassroots_early',
      stage: 'training',
      title: '基层的第一年',
      text: '设备有限，病人却很信你。你在这里学会的第一课，是如何用最少的资源做最稳的决定。',
      yearDelta: 1,
      options: [
        { text: '扎实做全科能力，积累群众口碑', label: '长期主义', target: 'drg_bootcamp', effects: { skill: 10, ethics: 8, network: 6, money: 4 }, flagsSet: ['community_trust'] },
        { text: '争取上级医院进修名额', label: '激进', target: 'drg_bootcamp', effects: { skill: 12, network: 8, stress: 8, money: -6 } },
        { text: '把基层当过渡，重点准备回城机会', label: '均衡', target: 'drg_bootcamp', effects: { skill: 5, stress: 6, network: 4, ethics: -3 } }
      ]
    },
    {
      id: 'drg_bootcamp',
      stage: 'training',
      title: 'DRG/DIP 培训课',
      text: '培训老师用一整个下午讲清楚一件事：同一个病人，收治路径不同，科室结余可能完全不同。而这与你的绩效有关。',
      yearDelta: 1,
      options: [
        { text: '认真学规则，理解成本与质量的边界', label: '长期主义', target: 'night_shift_call', effects: { skill: 10, ethics: 6, network: 5, stress: 3 }, flagsSet: ['drg_literate', 'balanced_drg'] },
        { text: '只记“怎么省钱”，把控费当唯一目标', label: '激进', target: 'night_shift_call', effects: { skill: 6, money: 8, ethics: -8, legalRisk: 6 }, flagsSet: ['over_controlled_cost'] },
        { text: '课上补觉，反正临床还是靠经验', label: '休息', target: 'night_shift_call', effects: { health: 8, stress: -8, skill: -3, legalRisk: 4 } }
      ]
    },
    {
      id: 'night_shift_call',
      stage: 'resident',
      title: '凌晨三点的呼叫',
      text: '值班手机响起：三床血压掉了。你从值班室弹起来，脑子比腿先醒。',
      yearDelta: 1,
      options: [
        { text: '立即床边评估并按流程处理', label: '稳妥', target: 'complex_case_turnaround', effects: { skill: 10, ethics: 6, health: -6, stress: 6, legalRisk: -4 } },
        { text: '先电话请示上级，再动手', label: '团队协作', target: 'complex_case_turnaround', effects: { network: 8, legalRisk: -6, skill: 5, stress: 3 } },
        { text: '先口头医嘱稳住，等天亮再补记录', target: 'complex_case_turnaround', effects: { health: 4, stress: -4, legalRisk: 10, ethics: -5 }, flagsSet: ['record_shortcut'] }
      ]
    },
    {
      id: 'complex_case_turnaround',
      stage: 'resident',
      major: true,
      title: '疑难病例的转机',
      text: '一位反复发热查不出原因的病人，家属已经开始怀疑一切。你手里有几种推进方式。',
      yearDelta: 1,
      options: [
        {
          text: '按指南逐层排查，稳步推进',
          label: '稳妥',
          safeChoice: true,
          effects: { skill: 6, ethics: 6, stress: 4 },
          check: {
            baseChance: 76,
            stats: { skill: 0.25, ethics: 0.2, health: 0.1, stress: -0.25 },
            minChance: 52,
            maxChance: 92,
            success: {
              target: 'ward_rounds',
              effects: { skill: 10, ethics: 6, network: 5, stress: -5 },
              feedback: '排查到第三轮时，答案自己浮了出来。',
              log: '判定成功（疑难病例）：规范排查帮你锁定了病因。'
            },
            failure: {
              target: 'ward_rounds',
              effects: { stress: 8, skill: 4, health: -4 },
              feedback: '病因仍不明确，但你的流程无可指摘。',
              log: '判定失败（疑难病例）：病因暂未明确，好在流程站得住。'
            }
          }
        },
        {
          text: '组织多学科会诊，集体决策',
          label: '团队协作',
          effects: { network: 8, stress: 3, money: -4 },
          check: {
            baseChance: 68,
            stats: { network: 0.35, skill: 0.25, ethics: 0.2, stress: -0.2 },
            minChance: 38,
            maxChance: 92,
            success: {
              target: 'ward_rounds',
              effects: { network: 12, skill: 8, legalRisk: -6, ethics: 5 },
              feedback: '多学科讨论给出了关键提示，责任也被合理分担。',
              log: '判定成功（疑难病例）：多学科会诊给出了关键方向。'
            },
            failure: {
              target: 'ward_rounds',
              effects: { stress: 6, network: 5, money: -4 },
              feedback: '会诊没有定论，但至少没有人再单打独斗。',
              log: '判定失败（疑难病例）：会诊未能定论，方案仍需观察。'
            }
          }
        },
        {
          text: '直接上高价检查与广谱方案，抢时间',
          label: '激进',
          riskyChoice: true,
          effects: { money: -8, stress: 6, skill: 4 },
          check: {
            baseChance: 48,
            stats: { skill: 0.4, research: 0.2, ethics: -0.15, stress: -0.25 },
            minChance: 18,
            maxChance: 84,
            success: {
              target: 'rare_recognition',
              effects: { skill: 12, network: 8, research: 6 },
              feedback: '你赌对了，病人转危为安，科里也记住了你。',
              log: '判定成功（疑难病例）：激进方案抢回了时间窗。'
            },
            failure: {
              target: 'complaint_case',
              effects: { stress: 12, money: -10, legalRisk: 10, ethics: -4 },
              feedback: '花费高、效果差，家属的情绪立刻转向。',
              log: '判定失败（疑难病例）：高成本方案没有奏效，投诉风险上升。'
            }
          }
        }
      ]
    },
    {
      id: 'ward_rounds',
      stage: 'resident',
      title: '早交班与查房',
      text: '主任的问题永远比你准备的多一个。今天他问的是：这个病人为什么住到第 9 天。',
      yearDelta: 1,
      options: [
        { text: '如实汇报并给出下一步计划', label: '稳妥', target: 'patient_talk', effects: { skill: 8, ethics: 6, legalRisk: -4, stress: 3 } },
        { text: '强调控费成效，弱化未解决的问题', target: 'patient_talk', effects: { network: 5, money: 5, ethics: -6, legalRisk: 6 }, flagsSet: ['over_controlled_cost'] },
        { text: '主动请示上级并调整方案', label: '团队协作', target: 'patient_talk', effects: { network: 8, skill: 6, legalRisk: -5, stress: -2 } }
      ]
    },
    {
      id: 'patient_talk',
      stage: 'resident',
      title: '沟通与知情同意',
      text: '家属带着打印好的资料来了，问题一条条列在纸上。走廊很吵，时间只有十分钟。',
      yearDelta: 1,
      options: [
        { text: '耐心逐条解释并留下书面记录', label: '长期主义', target: 'consultation_lastminute', effects: { ethics: 10, legalRisk: -10, network: 5, stress: 5, health: -3 }, flagsSet: ['good_communication', 'solid_records'] },
        { text: '简要说明重点，请上级补充说明', label: '团队协作', target: 'consultation_lastminute', effects: { network: 8, legalRisk: -5, stress: -3, ethics: 3 } },
        { text: '用术语快速结束对话，赶下一台手术', target: 'consultation_lastminute', effects: { stress: -5, skill: 3, ethics: -6, legalRisk: 10 } }
      ]
    },
    {
      id: 'consultation_lastminute',
      stage: 'resident',
      title: '下班前的最后一个会诊',
      text: '17:55，急会诊申请弹出。你的通勤地铁末班时间，和病人的病情，正在同一条时间轴上赛跑。',
      yearDelta: 1,
      options: [
        {
          text: '认真处理完再走，必要时留守',
          label: '稳妥',
          effects: { skill: 8, ethics: 8, health: -8, stress: 6, legalRisk: -6 },
          check: {
            baseChance: 74,
            stats: { skill: 0.25, ethics: 0.25, health: 0.15, stress: -0.25 },
            minChance: 50,
            maxChance: 92,
            success: {
              target: 'rare_recognition',
              effects: { skill: 8, network: 8, ethics: 5 },
              feedback: '你的处理很到位，请会诊的科室专门来道谢。',
              log: '判定成功（会诊）：你的处理被兄弟科室点名感谢。'
            },
            failure: {
              target: 'complaint_case',
              effects: { stress: 10, health: -5 },
              feedback: '你尽力了，但病情变化仍带来了后续纠纷。',
              log: '判定失败（会诊）：病情变化超出预期，后续出现纠纷。'
            }
          }
        },
        { text: '电话指导 + 明确交班给夜班', label: '团队协作', target: 'complaint_case', effects: { network: 6, health: 5, stress: -4, legalRisk: 4 } },
        { text: '写一句“建议专科随诊”就下班', target: 'complaint_case', effects: { health: 8, stress: -8, ethics: -8, legalRisk: 12 } }
      ]
    },
    {
      id: 'rare_recognition',
      stage: 'resident',
      title: '一次被记住的诊断',
      text: '你在常规检查里发现了一个不该被漏掉的细节，病人因此避开了一场大麻烦。',
      yearDelta: 1,
      options: [
        { text: '整理成病例报告，认真投出去', label: '长期主义', target: 'performance_review', effects: { research: 12, skill: 8, network: 6, stress: 4 }, flagsSet: ['clean_research', 'patient_recognized'] },
        { text: '在科内讲一次课，把经验留给同事', label: '团队协作', target: 'performance_review', effects: { network: 12, skill: 6, ethics: 6 }, flagsSet: ['patient_recognized'] },
        { text: '低调收下感谢，继续干活', label: '稳妥', target: 'performance_review', effects: { ethics: 8, health: 5, stress: -6 }, flagsSet: ['patient_recognized'] }
      ]
    },
    {
      id: 'complaint_case',
      stage: 'resident',
      title: '投诉与舆情',
      text: '一份投诉件转到了科里，同时有一段掐头去尾的走廊视频开始传播。',
      yearDelta: 1,
      options: [
        { text: '立即复盘病历，配合科室与医务处', label: '稳妥', target: 'mediation_meeting', effects: { ethics: 8, legalRisk: -12, stress: 8, network: 5 }, flagsSet: ['solid_records', 'legal_awareness'] },
        { text: '自己先在网上澄清，把细节讲清楚', label: '激进', target: 'mediation_meeting', effects: { network: 4, stress: 12, legalRisk: 8, ethics: -3 } },
        { text: '完全不回应，等风头过去', target: 'mediation_meeting', effects: { stress: 6, legalRisk: 6, network: -5, health: -3 } }
      ]
    },
    {
      id: 'mediation_meeting',
      stage: 'resident',
      title: '调解会',
      text: '会议室里坐着家属、医务处、律师和你。桌上的水杯没人动过。',
      yearDelta: 1,
      options: [
        { text: '按事实与记录说明，坚持专业判断', label: '稳妥', target: 'performance_review', effects: { ethics: 10, legalRisk: -14, stress: 6, network: 5 }, flagsSet: ['legal_awareness'] },
        { text: '接受科室建议的和解方案', label: '均衡', target: 'performance_review', effects: { money: -14, legalRisk: -10, stress: -5, ethics: 3 } },
        { text: '情绪上头，与家属正面争执', target: 'performance_review', effects: { stress: 14, legalRisk: 12, ethics: -8, network: -6, health: -5 } }
      ]
    },
    {
      id: 'performance_review',
      stage: 'resident',
      title: '年度绩效与考核',
      text: '表格上并列着：出院人次、平均住院日、次均费用、论文与教学工作量。你的年终奖取决于这些数字。',
      yearDelta: 1,
      options: [
        { text: '按规范收治，稳住质量指标', label: '稳妥', target: 'ai_and_online', effects: { skill: 8, ethics: 8, money: 5, legalRisk: -6 }, flagsSet: ['balanced_drg'] },
        { text: '冲量优先，多收快出提高人次', label: '激进', target: 'ai_and_online', effects: { money: 16, health: -10, stress: 12, ethics: -6 }, flagsSet: ['volume_first'] },
        { text: '主攻教学与科研加分项', label: '长期主义', target: 'ai_and_online', effects: { research: 12, network: 8, stress: 6, money: -3 } }
      ]
    },
    {
      id: 'ai_and_online',
      stage: 'resident',
      title: 'AI 辅助与互联网门诊',
      text: '医院上线了 AI 辅助书写与预问诊，也开了互联网复诊。方便是真的，风险也是真的。',
      yearDelta: 1,
      options: [
        { text: '把 AI 当草稿工具，逐条人工核对', label: '稳妥', target: 'promotion_gate', effects: { skill: 10, ethics: 6, legalRisk: -6, stress: -3 }, flagsSet: ['ai_prudent'] },
        { text: '大量依赖 AI 输出，追求效率最大化', label: '激进', target: 'promotion_gate', effects: { money: 10, health: 5, stress: -6, ethics: -8, legalRisk: 12 }, flagsSet: ['ai_overtrust'] },
        { text: '牵头制定科室 AI 使用规范', label: '团队协作', target: 'promotion_gate', effects: { network: 12, ethics: 8, legalRisk: -8, stress: 5 }, flagsSet: ['ai_prudent', 'admin_networking'] }
      ]
    },
    {
      id: 'promotion_gate',
      stage: 'senior',
      major: true,
      title: '中级晋副高的门槛',
      text: '晋升条件写得清清楚楚：年限、论文、下基层经历、教学工作量、病例质量。你只有有限的精力，必须押注。',
      yearDelta: 1,
      options: [
        {
          text: '稳妥路线：按条件逐项补齐，不走捷径',
          label: '稳妥',
          safeChoice: true,
          effects: { skill: 8, ethics: 8, stress: 6, health: -3 },
          check: {
            baseChance: 76,
            stats: { skill: 0.2, ethics: 0.2, network: 0.15, stress: -0.25 },
            minChance: 52,
            maxChance: 92,
            success: {
              target: 'chief_competition',
              effects: { network: 8, skill: 8, stress: -5 },
              feedback: '材料齐、口碑好，你顺利进入候选序列。',
              log: '判定成功（晋升）：条件逐项达标，你进入副高候选序列。'
            },
            failure: {
              target: 'promotion_setback',
              effects: { stress: 10, health: -4 },
              feedback: '有一项硬指标卡住了，你需要再等一年。',
              log: '判定失败（晋升）：硬指标未达标，你被推迟到下一轮。'
            }
          }
        },
        {
          text: '押注科研：全力冲论文与课题',
          label: '激进',
          target: 'research_track',
          effects: { research: 14, stress: 10, health: -6, network: 4 },
          conditions: { stats: { research: { min: 30 } } }
        },
        {
          text: '主攻行政与教学，做科室里不可替代的人',
          label: '团队协作',
          effects: { network: 10, stress: 5, skill: 4 },
          flagsSet: ['admin_networking'],
          check: {
            baseChance: 62,
            stats: { network: 0.4, ethics: 0.2, skill: 0.2, stress: -0.2 },
            minChance: 28,
            maxChance: 90,
            success: {
              target: 'chief_competition',
              effects: { network: 14, skill: 6, money: 6 },
              feedback: '你成了科室运转的关键人物，领导记住了你的名字。',
              log: '判定成功（晋升）：行政与教学积累让你进入候选名单。'
            },
            failure: {
              target: 'promotion_setback',
              effects: { stress: 8, network: 6, research: -3 },
              feedback: '人缘很好，可惜评审最后还是看硬指标。',
              log: '判定失败（晋升）：软实力没能替代硬指标。'
            }
          }
        },
        {
          text: '重新评估：考虑离开临床主线',
          label: '长期主义',
          target: 'alt_career_track',
          effects: { stress: -6, health: 6, money: 5, network: 4 }
        }
      ]
    },
    {
      id: 'chief_competition',
      stage: 'senior',
      title: '副高评审与竞聘答辩',
      text: '答辩十五分钟，评委的问题却横跨你过去十年的每一个选择。',
      yearDelta: 1,
      options: [
        {
          text: '以病例质量与教学成果为主线陈述',
          label: '稳妥',
          effects: { skill: 6, ethics: 6, stress: 5 },
          check: {
            baseChance: 74,
            stats: { skill: 0.25, ethics: 0.2, network: 0.15, stress: -0.25 },
            minChance: 50,
            maxChance: 92,
            success: {
              target: 'senior_outcome',
              effects: { network: 10, skill: 8, money: 12 },
              feedback: '你的表达朴实但扎实，评审全票通过。',
              log: '判定成功（评审）：扎实的临床与教学成果为你赢得通过。'
            },
            failure: {
              target: 'promotion_setback',
              effects: { stress: 10, network: 4 },
              feedback: '你答得不错，但名额确实有限。',
              log: '判定失败（评审）：名额有限，你被排在了下一轮。'
            }
          },
          flagsSet: ['chief_candidate']
        },
        {
          text: '主打科研成果与课题体量',
          label: '激进',
          effects: { research: 8, stress: 8 },
          check: {
            baseChance: 56,
            stats: { research: 0.45, network: 0.2, skill: 0.15, stress: -0.25 },
            minChance: 22,
            maxChance: 90,
            success: {
              target: 'senior_outcome',
              effects: { research: 12, network: 10, money: 14 },
              feedback: '成果单足够亮眼，评委没再多问。',
              log: '判定成功（评审）：科研体量帮你一举通过。'
            },
            failure: {
              target: 'promotion_setback',
              effects: { stress: 12, research: 4, health: -4 },
              feedback: '评委追问临床工作量，你答得有些勉强。',
              log: '判定失败（评审）：临床短板拖累了你的答辩。'
            }
          },
          flagsSet: ['chief_candidate']
        },
        {
          text: '与同科竞争者协商，共同争取两个名额',
          label: '团队协作',
          effects: { network: 10, ethics: 5, stress: -4 },
          check: {
            baseChance: 66,
            stats: { network: 0.4, ethics: 0.25, stress: -0.2, skill: 0.1 },
            minChance: 32,
            maxChance: 90,
            success: {
              target: 'senior_outcome',
              effects: { network: 14, ethics: 8, money: 10 },
              feedback: '科室多争到一个名额，你们都上了。',
              log: '判定成功（评审）：协作争取到了额外名额，双双通过。'
            },
            failure: {
              target: 'promotion_setback',
              effects: { stress: 8, network: 8, ethics: 4 },
              feedback: '名额没能加，但至少没有互相拆台。',
              log: '判定失败（评审）：名额未增加，你选择体面等待。'
            }
          }
        }
      ]
    },
    {
      id: 'promotion_setback',
      stage: 'senior',
      title: '晋升受挫的那一年',
      text: '公示名单上没有你的名字。生活还在继续，你需要决定这一年怎么过。',
      yearDelta: 1,
      options: [
        { text: '调整策略，明年再战', label: '长期主义', target: 'career_retry', effects: { skill: 8, research: 5, stress: 6 } },
        { text: '申请下基层支援，补齐经历短板', label: '稳妥', target: 'grassroots_track', effects: { ethics: 10, network: 6, health: 5, stress: -5 }, flagsSet: ['grassroots_path'] },
        { text: '接受现实，认真考虑换赛道', label: '均衡', target: 'alt_career_track', effects: { stress: -8, health: 6, money: 6 } }
      ]
    },
    {
      id: 'research_track',
      stage: 'senior',
      title: '科研主线的加速期',
      text: '你把大部分时间投进课题。临床同事说你“最近很少在病区看到你”。',
      yearDelta: 1,
      options: [
        { text: '扎实做真数据，慢一点也认', label: '长期主义', target: 'grant_revision', effects: { research: 12, ethics: 8, stress: 6 }, flagsSet: ['clean_research'] },
        { text: '压缩周期，尽快堆出成果', label: '激进', target: 'grant_revision', effects: { research: 14, ethics: -8, legalRisk: 10, stress: 10 }, flagsSet: ['rush_research'] },
        { text: '组建小团队，把课题拆给学生和同事', label: '团队协作', target: 'grant_revision', effects: { network: 12, research: 8, stress: -3, money: -6 } }
      ]
    },
    {
      id: 'grant_revision',
      stage: 'senior',
      title: '基金申请与返修',
      text: '函评意见回来了：创新性尚可，前期基础不足。你还有一次补充材料的机会。',
      yearDelta: 1,
      options: [
        {
          text: '补做前期实验，把基础坐实',
          label: '长期主义',
          effects: { research: 8, stress: 8, money: -8 },
          check: {
            baseChance: 58,
            stats: { research: 0.5, ethics: 0.2, network: 0.15, stress: -0.25 },
            minChance: 24,
            maxChance: 90,
            success: {
              target: 'talent_program',
              effects: { research: 14, network: 10, money: 20 },
              feedback: '补充材料很有说服力，项目获批。',
              log: '判定成功（基金）：扎实的前期数据帮你拿下项目。'
            },
            failure: {
              target: 'career_retry',
              effects: { stress: 10, money: -6 },
              feedback: '这一轮没中，你需要重新规划节奏。',
              log: '判定失败（基金）：项目未获批，你需要另寻突破口。'
            }
          },
          retry: {
            maxAttempts: 2,
            yearCostPerRetry: 1,
            costPerRetry: { stress: 8, money: -8 },
            bonusPerRetry: 10,
            alternativeTarget: 'career_retry'
          }
        },
        { text: '请合作者加入，共享数据与署名', label: '团队协作', target: 'talent_program', effects: { network: 14, research: 8, ethics: 4, money: -5 } },
        { text: '把不确定的结果写成确定的结论', target: 'career_retry', effects: { research: 6, ethics: -14, legalRisk: 16, stress: 5 }, flagsSet: ['questionable_research'] }
      ]
    },
    {
      id: 'talent_program',
      stage: 'senior',
      title: '人才计划与团队组建',
      text: '你拿到了一个不大不小的人才项目。启动经费、研究生名额，以及随之而来的考核压力。',
      yearDelta: 1,
      options: [
        { text: '认真带教，把团队长期养起来', label: '长期主义', target: 'senior_outcome', effects: { network: 12, research: 10, ethics: 8, stress: 5 }, flagsSet: ['talent_program', 'clean_research'] },
        { text: '高压推进，指标优先', label: '激进', target: 'senior_outcome', effects: { research: 14, money: 12, ethics: -8, stress: 12, health: -6 }, flagsSet: ['talent_program'] },
        { text: '控制规模，保证自己还能上临床', label: '稳妥', target: 'senior_outcome', effects: { skill: 10, health: 8, stress: -6, research: 5 }, flagsSet: ['talent_program'] }
      ]
    },
    {
      id: 'grassroots_track',
      stage: 'senior',
      title: '基层与对口支援',
      text: '你被派到县域医院，负责带教与学科建设。资源少，但你说了算的事情变多了。',
      yearDelta: 1,
      options: [
        { text: '认真建科室、带本地医生', label: '长期主义', target: 'senior_outcome', effects: { ethics: 12, network: 10, skill: 8, money: 5 }, flagsSet: ['community_trust'] },
        { text: '做出可复制的模式并向上汇报', label: '团队协作', target: 'senior_outcome', effects: { network: 14, research: 6, money: 8, stress: 5 }, flagsSet: ['public_admin'] },
        { text: '完成任务即可，重点保住身体', label: '休息', target: 'senior_outcome', effects: { health: 14, stress: -12, network: -3, skill: 2 } }
      ]
    },
    {
      id: 'alt_career_track',
      stage: 'senior',
      title: '转向的岔路口',
      text: '猎头、老同学、以及一个招聘公告同时出现在你的手机里。离开临床一线并不等于放弃医学。',
      yearDelta: 1,
      options: [
        { text: '进入药械企业医学事务岗', label: '均衡', target: 'ending_industry_ma', effects: { money: 30, stress: -6, health: 8, ethics: -3 } },
        { text: '加入互联网医疗平台', label: '激进', target: 'ending_internet_health', effects: { money: 22, network: 10, stress: 5, ethics: -2 } },
        { text: '考公进入卫生健康管理部门', label: '长期主义', target: 'ending_public_service', effects: { network: 14, stress: -5, money: 8, ethics: 6 }, flagsSet: ['public_admin'] },
        { text: '自己开一家规范的门诊部', label: '稳妥', target: 'private_track', effects: { money: -18, stress: 8, skill: 6, network: 6 } }
      ]
    },
    {
      id: 'career_retry',
      stage: 'senior',
      title: '重整旗鼓',
      text: '你把这几年的得失列在一张纸上。有些是运气，有些确实是选择。',
      yearDelta: 1,
      options: [
        { text: '回到临床主线，稳扎稳打到底', label: '稳妥', target: 'senior_outcome', effects: { skill: 12, ethics: 8, health: 5, stress: -5 } },
        { text: '换一个平台重新竞聘', label: '激进', target: 'chief_competition', effects: { network: 8, stress: 10, money: -8, skill: 5 } },
        { text: '去基层做学科带头人', label: '长期主义', target: 'grassroots_track', effects: { ethics: 10, network: 8, health: 6, stress: -4 }, flagsSet: ['grassroots_path'] },
        { text: '彻底转向非临床赛道', label: '均衡', target: 'alt_career_track', effects: { money: 10, stress: -6, health: 5 } }
      ]
    },
    {
      id: 'private_track',
      stage: 'senior',
      title: '自己的门诊部',
      text: '房租、人力、耗材、合规检查。你第一次发现，看病之外的事情能有这么多。',
      yearDelta: 1,
      options: [
        { text: '守住合规底线，慢慢积累口碑', label: '稳妥', target: 'senior_outcome', effects: { ethics: 12, money: 8, legalRisk: -10, stress: 4 }, flagsSet: ['private_balanced'] },
        { text: '扩张项目冲营收，边界能推就推', label: '激进', target: 'senior_outcome', effects: { money: 26, ethics: -12, legalRisk: 16, stress: 10 }, flagsSet: ['private_aggressive'] },
        { text: '与公立医院合作转诊，做长期生意', label: '团队协作', target: 'senior_outcome', effects: { network: 14, money: 12, ethics: 5, stress: 3 }, flagsSet: ['private_balanced'] }
      ]
    },
    {
      id: 'senior_outcome',
      stage: 'senior',
      major: true,
      title: '四十五岁的一个普通清晨',
      text: '窗外天刚亮，你在换鞋。回望一路，你可以选择用什么方式收尾。',
      yearDelta: 1,
      options: [
        {
          text: '竞聘科主任，扛起整个科室',
          label: '激进',
          target: 'ending_department_chief',
          effects: { network: 10, stress: 10, money: 12 },
          conditions: { stats: { network: { min: 55 }, ethics: { min: 40 }, legalRisk: { max: 60 } } }
        },
        {
          text: '做学术与带教的骨干',
          label: '长期主义',
          target: 'ending_academic_pillar',
          effects: { research: 10, network: 6, stress: 5 },
          conditions: { stats: { research: { min: 55 }, ethics: { min: 40 } } }
        },
        {
          text: '稳稳干到退休，把每一班都值好',
          label: '稳妥',
          safeChoice: true,
          target: 'ending_retire_respect',
          effects: { ethics: 10, health: 6, stress: -8, skill: 6 }
        },
        {
          text: '主动降速，把生活重新找回来',
          label: '休息',
          target: 'ending_balanced_life',
          effects: { health: 14, stress: -16, money: -5 }
        }
      ]
    },

    {
      id: 'ending_tech_escape',
      stage: 'ending',
      type: 'ending',
      title: '结局：代码比值班灯更亮',
      text: '你没走医学主线，过上了另一种高压但可控的人生。偶尔看见医学生梗图，会默默点个赞，然后按时下班。'
    },
    {
      id: 'ending_department_chief',
      stage: 'ending',
      type: 'ending',
      title: '结局：少数人的科主任',
      text: '你在长期积累中脱颖而出，终于带着团队往前走。荣耀背后，是无数个夜班和不能出错的决定。'
    },
    {
      id: 'ending_academic_pillar',
      stage: 'ending',
      type: 'ending',
      title: '结局：学术与临床双线骨干',
      text: '你不是流量神话，却在学术与带教中持续发光。学生记得你的严谨，患者记得你的耐心。'
    },
    {
      id: 'ending_retire_respect',
      stage: 'ending',
      type: 'ending',
      title: '结局：平凡而被尊重的退休',
      text: '你或许没有站上头衔的巅峰，却在几十年稳定行医中，赢得了同事与患者最实在的信任。'
    },
    {
      id: 'ending_balanced_life',
      stage: 'ending',
      type: 'ending',
      title: '结局：及时转弯的人生平衡',
      text: '你保留了专业身份，也把生活找了回来。这不是逃离，而是重新定义了什么叫成功。'
    },
    {
      id: 'ending_industry_ma',
      stage: 'ending',
      type: 'ending',
      title: '结局：医学事务转身',
      text: '你把临床经验转化为产业价值。争议仍在，但你学会了在边界之内推动改进。'
    },
    {
      id: 'ending_internet_health',
      stage: 'ending',
      type: 'ending',
      title: '结局：互联网医疗航道',
      text: '你在效率、合规与可及性之间找平衡。屏幕另一端，依然是一个个真实的人。'
    },
    {
      id: 'ending_public_service',
      stage: 'ending',
      type: 'ending',
      title: '结局：公共治理路线',
      text: '你放下听诊器，走进政策与管理。改变很慢，但你在做系统层面的努力。'
    },
    {
      id: 'ending_crisis_health',
      stage: 'ending',
      type: 'ending',
      title: '结局：身体先递交了辞呈',
      text: '在你决定休息之前，身体替你做了决定。你终于开始学习一件从没认真学过的事：照顾自己。'
    },
    {
      id: 'ending_crisis_stress',
      stage: 'ending',
      type: 'ending',
      title: '结局：情绪的紧急制动',
      text: '你在某个平常的早晨忽然走不进病区。这不是软弱，只是一根绷了太久的弦，终于需要被松开。'
    },
    {
      id: 'ending_crisis_legal',
      stage: 'ending',
      type: 'ending',
      title: '结局：合规红线之外',
      text: '那些被省略的记录、被跳过的流程，最终以调查通知的形式回到你面前。代价来得很慢，但一分不少。'
    },
    {
      id: 'ending_ethics_fall',
      stage: 'ending',
      type: 'ending',
      title: '结局：底线一寸寸退让之后',
      text: '你没有做过一件“大恶”，只是每次都退了一小步。回头看时，已经找不到最初站着的地方。'
    },
    {
      id: 'ending_crisis_read_receipts',
      stage: 'ending',
      type: 'ending',
      title: '结局：已读不回的人生',
      text: '你把所有消息都设成免打扰，包括家人的。世界还在响，只是你已经不再点开。'
    },
    {
      id: 'ending_crisis_phone_reflex',
      stage: 'ending',
      type: 'ending',
      title: '结局：铃声性心动过速',
      text: '离职三个月后，你听到任何手机铃声还是会先摸左口袋。医生说这叫条件反射，你说这叫职业病。'
    },
    {
      id: 'ending_crisis_night_shift_ghost',
      stage: 'ending',
      type: 'ending',
      title: '结局：值班室里的常驻幽灵',
      text: '同事说凌晨三点总能在值班室看见你。其实你只是不知道，除了这里还能去哪。'
    },
    {
      id: 'ending_crisis_badge_off',
      stage: 'ending',
      type: 'ending',
      title: '结局：把胸牌摘下的那天',
      text: '你把工牌轻轻放在桌上，动作比想象中平静。走出大门时，阳光有点刺眼。'
    },
    {
      id: 'ending_crisis_pc_crash',
      stage: 'ending',
      type: 'ending',
      title: '结局：病历系统与人一起卡死',
      text: '光标在病历页面上闪了很久。你盯着它，忽然发现自己也想不起下一句该写什么了。'
    }
  ];

  const GAME_DATA = {
    title: '一个中国医学生的一生',
    disclaimer: '本作是虚构与讽刺作品，不构成医学、法律或职业建议。不同地区与机构在 DRG/DIP、医保与管理实践上存在差异。',
    startEventId: 'gaokao_choice',
    fallbackEndingId: 'ending_balanced_life',
    statBounds: {
      health: [0, 100],
      stress: [0, 100],
      money: [-20, 200],
      skill: [0, 100],
      research: [0, 100],
      network: [0, 100],
      ethics: [0, 100],
      legalRisk: [0, 100]
    },
    stages: {
      gaokao: '高考与志愿',
      undergrad: '本科医学生',
      graduate: '研究生与科研',
      training: '执业考试/规培/求职',
      resident: '住院/主治阶段',
      senior: '副高/主任或转行分支',
      ending: '人生终局'
    },
    randomEvents,
    events
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
  }

  global.GAME_DATA = GAME_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
