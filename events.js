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
          label: '均衡',
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

  function findEvent(id) {
    return events.find((event) => event.id === id);
  }

  function insertEventAfter(afterId, event) {
    const index = events.findIndex((item) => item.id === afterId);
    if (index === -1) {
      events.push(event);
      return;
    }
    events.splice(index + 1, 0, event);
  }

  function walkOptionContainers(visitor) {
    const visitList = (list, scope) => {
      for (const event of list) {
        for (const option of event.options || []) {
          visitor(option, event, scope, 'option');
          if (option.check) {
            for (const branchName of ['success', 'failure']) {
              const branch = option.check[branchName];
              if (branch) visitor(branch, event, scope, branchName);
            }
          }
        }
      }
    };

    visitList(events, 'main');
    visitList(randomEvents, 'random');
  }

  function replaceTargets(oldTarget, newTarget) {
    walkOptionContainers((container) => {
      if (container.target === oldTarget) {
        container.target = newTarget;
      }
      if (Array.isArray(container.randomTargets)) {
        for (const randomTarget of container.randomTargets) {
          if (randomTarget.target === oldTarget) {
            randomTarget.target = newTarget;
          }
        }
      }
    });
  }

  function setScheduledEvents(container, entries) {
    if (!entries || !entries.length) return;
    container.scheduledEvents = (container.scheduledEvents || []).concat(entries.map((entry) => ({ ...entry })));
  }

  function scaleLegacyMoneyDelta(delta) {
    if (typeof delta !== 'number' || delta === 0) return delta;
    const sign = Math.sign(delta);
    const abs = Math.abs(delta);
    if (abs <= 2) return sign;
    if (abs <= 4) return sign * Math.max(1, Math.round(abs * 0.75));
    if (abs <= 10) return sign * Math.max(2, Math.round(abs * 0.6));
    return sign * Math.max(5, Math.round(abs * 0.5));
  }

  function rescaleMoneyEffects(effects) {
    if (!effects || typeof effects !== 'object' || typeof effects.money !== 'number') return;
    effects.money = scaleLegacyMoneyDelta(effects.money);
  }

  walkOptionContainers((container) => {
    rescaleMoneyEffects(container.effects);
    for (const delayed of container.delayed || []) {
      rescaleMoneyEffects(delayed.effects);
    }
  });

  const specialtyProfiles = {
    pediatrics: {
      name: '儿科',
      group: 'acute',
      intensity: 5,
      dispute: 5,
      learning: 4,
      procedure: 3,
      research: 3,
      demand: '长期紧缺，季节高峰明显',
      income: 3,
      control: 2,
      risk: '流感季门急诊高峰与家长焦虑叠加',
      opportunity: '儿童专病与紧缺岗位带来成长窗口'
    },
    emergency_critical: {
      name: '急诊/重症',
      group: 'acute',
      intensity: 5,
      dispute: 4,
      learning: 5,
      procedure: 4,
      research: 3,
      demand: '急危重症岗位需求长期存在',
      income: 4,
      control: 1,
      risk: '连续抢救、床位协调与多学科联动',
      opportunity: '急救能力与抢救决策成长极快'
    },
    internal: {
      name: '内科系统',
      group: 'internal',
      intensity: 4,
      dispute: 3,
      learning: 4,
      procedure: 2,
      research: 4,
      demand: '基础学科体量大、分化多',
      income: 3,
      control: 3,
      risk: '慢病管理、疑难鉴别与病程拉锯',
      opportunity: '亚专科分化和科研路径都较完整'
    },
    surgery: {
      name: '外科系统',
      group: 'surgery',
      intensity: 5,
      dispute: 4,
      learning: 5,
      procedure: 5,
      research: 3,
      demand: '手术岗位需求稳定但训练陡峭',
      income: 4,
      control: 2,
      risk: '围术期风险、体力消耗与团队默契要求高',
      opportunity: '操作积累快，成就感和平台效应都明显'
    },
    obgyn: {
      name: '妇产科',
      group: 'acute',
      intensity: 5,
      dispute: 4,
      learning: 4,
      procedure: 4,
      research: 3,
      demand: '产科夜间负荷和基层需求都高',
      income: 4,
      control: 2,
      risk: '围产期突发风险与家属预期波动',
      opportunity: '产房与手术协作能力成长很快'
    },
    anesthesia: {
      name: '麻醉科',
      group: 'platform',
      intensity: 4,
      dispute: 3,
      learning: 4,
      procedure: 5,
      research: 3,
      demand: '平台学科需求高，排班受手术台影响大',
      income: 4,
      control: 3,
      risk: '围术期监护、插管与突发抢救压力',
      opportunity: '技术门槛高，跨手术团队协作广'
    },
    dental: {
      name: '口腔科',
      group: 'surgery',
      intensity: 3,
      dispute: 3,
      learning: 4,
      procedure: 4,
      research: 2,
      demand: '门诊与专科机构差异较大',
      income: 4,
      control: 4,
      risk: '患者预期高、操作精细度要求高',
      opportunity: '排班相对可规划，技术积累带来口碑增长'
    },
    ent_oph: {
      name: '眼科/耳鼻喉科',
      group: 'surgery',
      intensity: 3,
      dispute: 3,
      learning: 4,
      procedure: 4,
      research: 3,
      demand: '门诊量与设备门槛都不低',
      income: 4,
      control: 4,
      risk: '精细操作、患者期待和设备依赖并存',
      opportunity: '计划性更强，但竞争和技术壁垒同样明显'
    },
    imaging_ultrasound: {
      name: '影像/超声',
      group: 'platform',
      intensity: 3,
      dispute: 3,
      learning: 4,
      procedure: 3,
      research: 3,
      demand: '平台学科周转压力稳定存在',
      income: 3,
      control: 4,
      risk: '报告时效、漏诊风险与跨科沟通',
      opportunity: 'AI 工具、亚专科判读与超声操作都有空间'
    },
    pathology_lab: {
      name: '病理/检验',
      group: 'platform',
      intensity: 3,
      dispute: 2,
      learning: 4,
      procedure: 2,
      research: 4,
      demand: '关键平台岗位稳定但容易被低估',
      income: 3,
      control: 4,
      risk: '报告质量、周转时效与临床接口压力',
      opportunity: '平台深耕和科研合作都较有延展性'
    },
    psychiatry: {
      name: '精神科',
      group: 'internal',
      intensity: 4,
      dispute: 4,
      learning: 4,
      procedure: 1,
      research: 3,
      demand: '心理健康需求持续上升',
      income: 3,
      control: 3,
      risk: '长期沟通、风险评估与家属支持体系',
      opportunity: '长期随访关系深，综合干预能力成长明显'
    },
    general_practice: {
      name: '全科/基层',
      group: 'internal',
      intensity: 3,
      dispute: 3,
      learning: 3,
      procedure: 2,
      research: 2,
      demand: '基层慢病、公卫与转诊需求持续存在',
      income: 3,
      control: 4,
      risk: '资源有限下的连续照护与居民信任维护',
      opportunity: '社区信任、慢病管理和政策岗位路径更清晰'
    }
  };

  const specialtyGroupTargets = {
    acute: 'specialty_acute_choice',
    internal: 'specialty_internal_choice',
    surgery: 'specialty_surgery_choice',
    platform: 'specialty_platform_choice'
  };

  function specialtyFlag(id) {
    return `specialty_${id}`;
  }

  function makeSpecialtySchedules(id, previewA, previewB) {
    const name = specialtyProfiles[id].name;
    return [
      {
        delay: 1,
        eventId: `re_sp_${id}_frontline`,
        once: true,
        source: `因为你定下了「${name}」方向，第一轮科室现实很快找上门来。`,
        preview: previewA
      },
      {
        delay: 3,
        eventId: `re_sp_${id}_career`,
        once: true,
        source: `因为你定下了「${name}」方向，新的职业代价与机会随后出现。`,
        preview: previewB
      }
    ];
  }

  const specialtyChoiceEffects = {
    pediatrics: { skill: 6, ethics: 6, stress: 5, money: -2 },
    emergency_critical: { skill: 8, stress: 6, health: -4, money: 2 },
    internal: { skill: 6, research: 4, stress: 3 },
    surgery: { skill: 7, stress: 5, health: -3, money: 1 },
    obgyn: { skill: 7, ethics: 4, stress: 5, health: -3 },
    anesthesia: { skill: 7, stress: 4, money: 2 },
    dental: { skill: 6, money: 4, stress: 2 },
    ent_oph: { skill: 6, money: 3, stress: 2 },
    imaging_ultrasound: { skill: 6, research: 3, stress: 2 },
    pathology_lab: { research: 6, skill: 4, stress: 1 },
    psychiatry: { ethics: 7, skill: 5, stress: 4 },
    general_practice: { ethics: 8, network: 4, money: 3, stress: 2 }
  };

  const specialtyDirectionChoice = {
    id: 'specialty_direction_choice',
    stage: 'training',
    major: true,
    title: '重大抉择：选择科室方向',
    text: '实习、规培打听和带教观察之后，你终于要定下最影响未来十年的选择。这里没有绝对排名，只有不同医院、地区和你本人承受方式共同塑造出来的现实。',
    yearDelta: 0,
    options: [
      { text: '急危重与围术期方向：抢救、产房、手术台', label: '激进', target: specialtyGroupTargets.acute, consequenceHint: '后续夜班、突发风险和团队协作事件会明显增多' },
      { text: '内科与连续照护方向：病程管理、长期沟通、基层连接', label: '长期主义', target: specialtyGroupTargets.internal, consequenceHint: '后续慢病、沟通、科研与社区信任事件会更常见' },
      { text: '手术与精细操作方向：刀台、门诊操作、技术积累', label: '均衡', target: specialtyGroupTargets.surgery, consequenceHint: '后续操作训练、患者预期与排班取舍会持续影响你' },
      { text: '平台支持方向：判读、检验、影像与科室协同', label: '稳妥', safeChoice: true, target: specialtyGroupTargets.platform, consequenceHint: '后续报告质量、周转时效与跨科沟通会成为主线压力' }
    ]
  };

  const specialtySubChoices = [
    {
      id: 'specialty_acute_choice',
      title: '重大抉择：急危重与围术期细分',
      options: [
        {
          text: '儿科：高峰季、家长沟通与长期紧缺都在这里',
          label: '稳妥',
          safeChoice: true,
          target: 'night_shift_call',
          specialty: 'pediatrics',
          effects: specialtyChoiceEffects.pediatrics,
          flagsSet: [specialtyFlag('pediatrics')],
          scheduledEvents: makeSpecialtySchedules('pediatrics', '可能很快遭遇儿科高峰与家长沟通压力', '后续会出现紧缺岗位与家庭节奏冲突')
        },
        {
          text: '急诊/重症：接受连轴转与抢救时钟',
          target: 'night_shift_call',
          specialty: 'emergency_critical',
          effects: specialtyChoiceEffects.emergency_critical,
          flagsSet: [specialtyFlag('emergency_critical')],
          scheduledEvents: makeSpecialtySchedules('emergency_critical', '可能很快遭遇抢救潮与夜班叠加', '后续会出现床位协调与高强度留任机会')
        },
        {
          text: '妇产科：产房、手术和沟通都要扛住',
          target: 'night_shift_call',
          specialty: 'obgyn',
          effects: specialtyChoiceEffects.obgyn,
          flagsSet: [specialtyFlag('obgyn')],
          scheduledEvents: makeSpecialtySchedules('obgyn', '可能很快遭遇围产期突发风险', '后续会出现产房值守与职业口碑机会')
        }
      ]
    },
    {
      id: 'specialty_internal_choice',
      title: '重大抉择：连续照护方向细分',
      options: [
        {
          text: '内科系统：病程长、分化多、科研也卷',
          label: '稳妥',
          safeChoice: true,
          target: 'night_shift_call',
          specialty: 'internal',
          effects: specialtyChoiceEffects.internal,
          flagsSet: [specialtyFlag('internal')],
          scheduledEvents: makeSpecialtySchedules('internal', '可能很快遇到疑难鉴别与慢病管理拉锯', '后续会出现亚专科深耕与论文压力')
        },
        {
          text: '精神科：长期沟通、风险评估与家属支持',
          target: 'night_shift_call',
          specialty: 'psychiatry',
          effects: specialtyChoiceEffects.psychiatry,
          flagsSet: [specialtyFlag('psychiatry')],
          scheduledEvents: makeSpecialtySchedules('psychiatry', '可能很快遇到危机评估与家属沟通', '后续会出现长期随访与社会支持议题')
        },
        {
          text: '全科/基层：慢病、公卫、转诊与居民信任',
          target: 'night_shift_call',
          specialty: 'general_practice',
          effects: specialtyChoiceEffects.general_practice,
          flagsSet: [specialtyFlag('general_practice'), 'grassroots_path'],
          scheduledEvents: makeSpecialtySchedules('general_practice', '可能很快遇到签约居民与转诊协同压力', '后续会出现社区口碑与政策岗位机会')
        }
      ]
    },
    {
      id: 'specialty_surgery_choice',
      title: '重大抉择：操作与手术方向细分',
      options: [
        {
          text: '外科系统：刀台、体力和围术期风暴一起上',
          label: '稳妥',
          safeChoice: true,
          target: 'night_shift_call',
          specialty: 'surgery',
          effects: specialtyChoiceEffects.surgery,
          flagsSet: [specialtyFlag('surgery')],
          scheduledEvents: makeSpecialtySchedules('surgery', '可能很快遇到术前准备失误或术后并发症处理', '后续会出现手术量增长与家庭时间冲突')
        },
        {
          text: '口腔科：门诊操作更可规划，但精细技术与患者预期更高',
          target: 'night_shift_call',
          specialty: 'dental',
          effects: specialtyChoiceEffects.dental,
          flagsSet: [specialtyFlag('dental')],
          scheduledEvents: makeSpecialtySchedules('dental', '可能很快遇到复诊安排与技术口碑考验', '后续会出现排班选择与自费项目压力')
        },
        {
          text: '眼科/耳鼻喉科：节奏更计划化，但设备和精细度同样不轻',
          target: 'night_shift_call',
          specialty: 'ent_oph',
          effects: specialtyChoiceEffects.ent_oph,
          flagsSet: [specialtyFlag('ent_oph')],
          scheduledEvents: makeSpecialtySchedules('ent_oph', '可能很快遇到精细操作与设备排队问题', '后续会出现专病门诊机会与竞争压力')
        }
      ]
    },
    {
      id: 'specialty_platform_choice',
      title: '重大抉择：平台支持方向细分',
      options: [
        {
          text: '麻醉科：在幕后稳住整台手术的呼吸与节奏',
          label: '稳妥',
          safeChoice: true,
          target: 'night_shift_call',
          specialty: 'anesthesia',
          effects: specialtyChoiceEffects.anesthesia,
          flagsSet: [specialtyFlag('anesthesia')],
          scheduledEvents: makeSpecialtySchedules('anesthesia', '可能很快遇到突发插管与围术期抢救', '后续会出现手术台扩容与排班议价')
        },
        {
          text: '影像/超声：报告质量、时效和跨科沟通一起卷',
          target: 'night_shift_call',
          specialty: 'imaging_ultrasound',
          effects: specialtyChoiceEffects.imaging_ultrasound,
          flagsSet: [specialtyFlag('imaging_ultrasound')],
          scheduledEvents: makeSpecialtySchedules('imaging_ultrasound', '可能很快遇到报告时效与漏诊压力', '后续会出现 AI 判读与亚专科发展机会')
        },
        {
          text: '病理/检验：平台支撑全院，但错误代价同样沉重',
          target: 'night_shift_call',
          specialty: 'pathology_lab',
          effects: specialtyChoiceEffects.pathology_lab,
          flagsSet: [specialtyFlag('pathology_lab')],
          scheduledEvents: makeSpecialtySchedules('pathology_lab', '可能很快遇到样本积压与质控追责', '后续会出现科研合作与平台话语权机会')
        }
      ]
    }
  ].map((event) => ({
    stage: 'training',
    major: true,
    yearDelta: 0,
    ...event
  }));

  const startIntroEvent = {
    id: 'admission_985_intro',
    stage: 'undergrad',
    major: true,
    title: '重大抉择：985 医学院报到日',
    text: '中学与高考被压缩成了简短序章：你已经拿到一所顶尖综合大学医学院的录取通知书。真正拉开差距的，不是那张分数条，而是你入学后的第一种活法。',
    yearDelta: 1,
    options: [
      {
        text: '先把基础课、作息和节奏稳住，做个不冒进的新生',
        label: '稳妥',
        safeChoice: true,
        target: 'freshman_life',
        effects: { health: 8, stress: -5, skill: 5, money: -2 },
        flagsSet: ['foundation_track'],
        scheduledEvents: [{ delay: 2, eventId: 're_foundation_osce', once: true, source: '因为你开局选择了稳住基础，老师很快把你推到了基本功考核前。', preview: '可能很快遇到基础能力抽查' }],
        consequenceHint: '后续更容易遇到基础能力与时间管理考验'
      },
      {
        text: '尽早进组、冲科研项目，试着提前占位',
        label: '激进',
        target: 'freshman_life',
        effects: { research: 8, stress: 6, health: -3, money: -1 },
        flagsSet: ['early_research_track'],
        scheduledEvents: [{ delay: 2, eventId: 're_early_lab_commitment', once: true, source: '因为你开局抢先冲进实验室，科研节奏会提前压到你身上。', preview: '可能很快遇到实验室占用与署名取舍' }],
        consequenceHint: '后续更容易引来实验室任务和导师要求'
      },
      {
        text: '先适应校园和人际，再决定自己卷到什么程度',
        label: '均衡',
        target: 'freshman_life',
        effects: { network: 8, health: 5, stress: -2, money: -2 },
        flagsSet: ['campus_balance_track'],
        scheduledEvents: [{ delay: 2, eventId: 're_club_pull', once: true, source: '因为你把开局重心放在人际与适应，新的社团与项目邀请很快出现。', preview: '可能很快遇到社团与学业取舍' }],
        consequenceHint: '后续更容易遇到人际资源与时间分配问题'
      },
      {
        text: '一边读医学，一边认真保留转专业和转轨的观察期',
        label: '长期主义',
        target: 'freshman_life',
        effects: { skill: 4, stress: 3, ethics: 3, money: -1 },
        flagsSet: ['major_doubt'],
        scheduledEvents: [{ delay: 3, eventId: 're_transfer_window', once: true, source: '因为你从入学起就保留了转轨观察，新的岔路口会在后面出现。', preview: '可能很快遇到转专业或双学位窗口' }],
        consequenceHint: '后续可能解锁转轨或双学位窗口'
      }
    ]
  };

  insertEventAfter('drg_bootcamp', specialtyDirectionChoice);
  for (const event of specialtySubChoices.slice().reverse()) {
    insertEventAfter('specialty_direction_choice', event);
  }
  insertEventAfter('ending_crisis_pc_crash', startIntroEvent);
  const drgBootcamp = findEvent('drg_bootcamp');
  for (const option of drgBootcamp?.options || []) {
    if (option.target === 'night_shift_call') {
      option.target = 'specialty_direction_choice';
    }
  }

  randomEvents.push(
    {
      id: 're_foundation_osce',
      stage: 'undergrad',
      title: '🎯 基础能力抽查',
      text: '因为你开局把基础打得很稳，带教把你点去做一次额外 OSCE 抽查。现在轮到你把“稳妥”变成看得见的结果了。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'anatomy_lab',
      options: [
        { text: '按步骤完成，不抢花活', label: '稳妥', effects: { skill: 6, stress: 2, money: 2 } },
        { text: '主动要求多做一项，顺便刷存在感', label: '激进', effects: { skill: 8, network: 4, stress: 5 } },
        { text: '和同学互相纠错后再上', label: '团队协作', effects: { skill: 5, network: 6, stress: -2 } }
      ]
    },
    {
      id: 're_early_lab_commitment',
      stage: 'undergrad',
      title: '🎯 提前进组的代价',
      text: '因为你太早冲进实验室，导师默认你周末也能到。项目名额是真的，时间吞噬也是真的。',
      rarity: 'uncommon',
      weight: 6,
      returnTo: 'biochem_week',
      options: [
        { text: '谈清边界，只接自己能扛住的任务', label: '稳妥', effects: { research: 5, stress: -2, money: 2 } },
        { text: '全都接下，先把位置站稳', label: '激进', effects: { research: 9, stress: 8, health: -5 } },
        { text: '找师兄师姐问清规则后再接活', label: '团队协作', effects: { research: 4, network: 7, stress: 1 } }
      ]
    },
    {
      id: 're_club_pull',
      stage: 'undergrad',
      title: '🎯 社团和项目开始找你',
      text: '因为你开局把适应与人际放在前面，班级、社团和志愿活动都开始拉你进群。好机会和时间碎片一起来了。',
      rarity: 'common',
      weight: 8,
      returnTo: 'clerkship_intro',
      options: [
        { text: '只保留一个真正能学到东西的组织', label: '稳妥', effects: { network: 5, stress: -2, health: 3 } },
        { text: '都试试，先把人脉铺开', label: '激进', effects: { network: 10, stress: 6, health: -4 } },
        { text: '拉上同学一起分工参与', label: '团队协作', effects: { network: 8, skill: 3, stress: 1 } }
      ]
    },
    {
      id: 're_transfer_window',
      stage: 'undergrad',
      title: '🎯 转专业窗口',
      text: '因为你从入学起就保留了观察期，学院发来了双学位和转专业咨询通知。医学线外的空气，突然有了真实的味道。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'mentor_choice',
      options: [
        { text: '继续留在医学，但给自己定个复盘节点', label: '稳妥', effects: { ethics: 5, stress: -3, skill: 3 } },
        { text: '报名辅修，给未来留个出口', label: '均衡', effects: { skill: 3, research: 4, stress: 4, money: -3 } },
        { text: '开始认真筹备转轨材料', label: '激进', effects: { stress: 6, network: 4, money: -2 }, flagsSet: ['transfer_ready'] }
      ]
    }
  );

  function createSpecialtyEvent(id, stage, suffix, title, text, options) {
    randomEvents.push({
      id: `re_sp_${id}_${suffix}`,
      stage,
      title,
      text,
      rarity: stage === 'resident' ? 'uncommon' : 'rare',
      weight: 6,
      returnTo: stage === 'resident' ? 'ward_rounds' : 'promotion_gate',
      requireFlags: [specialtyFlag(id)],
      options
    });
  }

  for (const [id, profile] of Object.entries(specialtyProfiles)) {
    const intensityPenalty = Math.max(1, profile.intensity - 2);
    const controlBonus = Math.max(0, profile.control - 2);
    const incomeBonus = Math.max(0, profile.income - 2);
    const disputePenalty = Math.max(1, profile.dispute - 1);

    createSpecialtyEvent(
      id,
      'resident',
      'frontline',
      `🎯 ${profile.name}的一线压力`,
      `${profile.name}最近正碰上：${profile.risk}。这条线在游戏里被概括为“${profile.demand}”，不代表所有医院都一样，但你确实感到这份 specialty profile 正在变成现实。`,
      [
        { text: '按流程稳住节奏，宁可慢一点也不越线', label: '稳妥', effects: { skill: 4, ethics: 4, stress: 3 + disputePenalty, legalRisk: -3, health: -intensityPenalty } },
        { text: '多接一点、多做一点，尽快把手练出来', label: '激进', effects: { skill: 7, money: 3 + incomeBonus, stress: 7 + intensityPenalty, health: -(2 + intensityPenalty) } },
        { text: '把同事、上级和相关科室都拉进来一起扛', label: '团队协作', effects: { network: 7, stress: -2 + intensityPenalty, legalRisk: -2, skill: 3 } }
      ]
    );

    createSpecialtyEvent(
      id,
      'resident',
      'craft',
      `🎯 ${profile.name}的技术门槛`,
      `${profile.name}的 specialty profile 写着：技术学习曲线 ${profile.learning}/5，操作要求 ${profile.procedure}/5，生活可控性 ${profile.control}/5。你现在要决定，怎么跨过这道门槛。`,
      [
        { text: '慢一点，先把关键动作练到稳', label: '稳妥', effects: { skill: 5, stress: 2, health: controlBonus, money: 1 } },
        { text: '抢着做高难度病例，逼自己加速成长', label: '激进', effects: { skill: 8, stress: 6, health: -2, legalRisk: disputePenalty } },
        { text: '找愿意带人的老师做针对性复盘', label: '团队协作', effects: { skill: 5, network: 6, stress: -1, money: -1 } }
      ]
    );

    createSpecialtyEvent(
      id,
      'senior',
      'career',
      `🎯 ${profile.name}的职业岔路`,
      `${profile.name}并不存在统一的轻松或艰难答案。你眼前这家医院的现实是：科研竞争 ${profile.research}/5，收入成长潜力 ${profile.income}/5，就业供需表现为“${profile.demand}”。新的机会来了，代价也跟着来了。`,
      [
        { text: '守住当下岗位，慢慢累积口碑和病例', label: '稳妥', effects: { money: 2 + incomeBonus, stress: 1 + disputePenalty, skill: 4, ethics: 3 } },
        { text: `主动争取：${profile.opportunity}`, label: '长期主义', effects: { skill: 6, network: 4, research: profile.research >= 4 ? 5 : 2, stress: 4 + intensityPenalty, money: 3 + incomeBonus } },
        { text: '重新评估是否转岗/转科/转去更能承受的环境', label: '均衡', effects: { health: 4 + controlBonus, stress: -(2 + controlBonus), money: -2, network: -1 }, flagsSet: ['consider_switching_specialty'] }
      ]
    );
  }

  randomEvents.push(
    {
      id: 're_specialty_transfer_window',
      stage: 'resident',
      title: '🎲 转科念头浮上来',
      text: '你开始怀疑：现在这条 specialty 线，究竟是你想要的，还是你只是已经走得太远。医院也给了少量转科和转岗窗口。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'performance_review',
      conditions: { specialties: Object.keys(specialtyProfiles) },
      options: [
        { text: '先不动，继续把当前能力补齐', label: '稳妥', effects: { skill: 4, stress: -2, ethics: 3 } },
        { text: '申请转到生活更可控的岗位', label: '均衡', effects: { health: 7, stress: -6, network: -3, skill: -2, money: -3 }, flagsSet: ['switched_role'] },
        { text: '赌一次彻底重来，哪怕损失人脉和时间', label: '激进', effects: { health: 3, stress: 5, network: -6, skill: -4, money: -5 }, flagsSet: ['switched_role'] }
      ]
    },
    {
      id: 're_specialty_cross_consult',
      stage: 'resident',
      title: '🎲 跨科协作的摩擦',
      text: '一个病例卡在你和兄弟科室之间：到底是谁先推进、谁担责任、谁来跟家属解释，没有人愿意先开口。',
      rarity: 'common',
      weight: 7,
      returnTo: 'patient_talk',
      conditions: { specialties: Object.keys(specialtyProfiles) },
      options: [
        { text: '把界面和流程写清楚，再推动一次', label: '稳妥', effects: { legalRisk: -4, network: 4, stress: 3 } },
        { text: '先把病人接住，责任后面再说', label: '激进', effects: { ethics: 5, stress: 7, legalRisk: 4, skill: 4 } },
        { text: '组织一个短会，让关键人一起拍板', label: '团队协作', effects: { network: 8, stress: -2, legalRisk: -3 } }
      ]
    },
    {
      id: 're_specialty_board_course',
      stage: 'senior',
      title: '🎲 专科进修名额',
      text: '医院放出一个专科进修或高级培训名额。它能让你往前一步，但也会占掉钱、时间和家庭空间。',
      rarity: 'uncommon',
      weight: 5,
      returnTo: 'senior_outcome',
      conditions: { specialties: Object.keys(specialtyProfiles) },
      options: [
        { text: '去，但先把家里和科室都沟通好', label: '稳妥', effects: { skill: 6, network: 5, money: -6, stress: 3 } },
        { text: '不去，先保住当前生活可控性', label: '休息', effects: { health: 6, stress: -5, research: -2 } },
        { text: '争取公费或联合培养，把成本摊开', label: '团队协作', effects: { network: 8, money: -2, stress: 1, skill: 4 } }
      ]
    },
    {
      id: 're_specialty_low_cost_shift',
      stage: 'senior',
      title: '🎲 更低成本城市的邀请',
      text: '一家新院区或地市医院抛来橄榄枝：收入不一定暴涨，但房租、通勤和夜班结构可能更适合你现在的人生阶段。',
      rarity: 'rare',
      weight: 4,
      returnTo: 'senior_outcome',
      conditions: { specialties: Object.keys(specialtyProfiles), stats: { money: { max: 35 } } },
      options: [
        { text: '认真算账后接受，换一个活法', label: '稳妥', effects: { money: 10, stress: -8, health: 6, network: -3 }, flagsSet: ['low_cost_city'] },
        { text: '留下来，赌大城市的后劲', label: '激进', effects: { money: -4, stress: 6, network: 5 } },
        { text: '先谈条件，看能不能带着 specialty 优势平移', label: '团队协作', effects: { network: 8, money: 4, stress: -2 } }
      ]
    }
  );

  randomEvents.push(
    {
      id: 're_forced_financial_crisis',
      stage: 'resident',
      title: '⚠️ 财务危机',
      text: '你的经济状况已经跌到谷底。房租、培训费、家里电话和银行卡余额同时盯着你：这一次不能再假装“下个月会好”。',
      rarity: 'rare',
      weight: 1,
      returnTo: 'performance_review',
      options: [
        { text: '向家里坦白，接受一次援助', label: '稳妥', effects: { money: 18, stress: -6, ethics: 2 }, flagsSet: ['family_bailout'] },
        { text: '申请贷款或债务分期，先把眼前缺口补上', label: '均衡', effects: { money: 22, stress: 6, health: -2 }, flagsSet: ['debt_burden'], scheduledEvents: [{ delay: 2, eventId: 're_forced_debt_pressure', once: false, source: '因为你靠贷款或债务分期缓过了这一口气，还款压力不会消失。', preview: '后续会出现还款与现金流压力' }] },
        { text: '离开高成本城市，主动换一个更能活下去的岗位', label: '长期主义', effects: { money: 14, stress: -5, health: 5, skill: -3, network: -4 }, flagsSet: ['low_cost_city'] },
        { text: '硬拖着不处理，继续透支未来', label: '激进', target: 'ending_finance_forced_exit', effects: { health: -8, stress: 10, ethics: -4 } }
      ]
    },
    {
      id: 're_forced_debt_pressure',
      stage: 'resident',
      title: '⚠️ 还款提醒',
      text: '贷款宽限期过去了。短信开始按月来，情绪也开始按月掉。你得决定，是继续硬扛，还是主动重排生活结构。',
      rarity: 'uncommon',
      weight: 2,
      returnTo: 'ward_rounds',
      requireFlags: ['debt_burden'],
      options: [
        { text: '砍掉高成本消费，稳稳还款', label: '稳妥', effects: { money: 8, stress: -4, health: 2 }, flagsSet: ['debt_repayment_plan'] },
        { text: '接更多班和副业，把现金流拉回来', label: '激进', effects: { money: 12, stress: 8, health: -6 } },
        { text: '再次展期，先活下来再说', label: '均衡', target: 'ending_finance_debt_loop', effects: { money: 4, stress: 6, ethics: -3 } }
      ]
    },
    {
      id: 're_financial_recovery_window',
      stage: 'senior',
      title: '🎯 财务恢复窗口',
      text: '你终于遇到一次不那么光鲜、但足够务实的恢复机会：低成本搬迁、稳定岗位或靠谱副职，至少能让现金流回正。',
      rarity: 'uncommon',
      weight: 4,
      returnTo: 'senior_outcome',
      conditions: { anyFlags: ['debt_burden', 'low_cost_city', 'family_bailout'], stats: { money: { max: 35 } } },
      options: [
        { text: '接受稳定但不耀眼的恢复路线', label: '稳妥', effects: { money: 14, stress: -8, health: 5 } },
        { text: '把副职和主业重新排班，慢慢回血', label: '均衡', effects: { money: 10, stress: 2, health: -2, skill: 3 } },
        { text: '嫌赚得太慢，继续赌下一次暴涨', label: '激进', effects: { money: -4, stress: 7, legalRisk: 4 } }
      ]
    },
    {
      id: 're_forced_research_audit',
      stage: 'graduate',
      title: '⚠️ 学术诚信抽检',
      text: '因为你之前走过一次数据或结论上的捷径，院里忽然开始抽检原始记录。你知道，这次不是运气题了。',
      rarity: 'rare',
      weight: 2,
      returnTo: 'paper_deadline',
      requireFlags: ['questionable_research'],
      options: [
        { text: '主动补材料并承认疏漏，尽量保住底线', label: '稳妥', effects: { ethics: 6, research: -3, stress: 6, legalRisk: -2 } },
        { text: '继续修饰说法，赌没人继续追', label: '激进', effects: { research: 3, ethics: -10, legalRisk: 10, stress: 8 } },
        { text: '找导师一起补救，争取把损害降到最低', label: '团队协作', effects: { network: 7, ethics: 4, stress: 3, research: -2 } }
      ]
    },
    {
      id: 're_forced_record_audit',
      stage: 'resident',
      title: '⚠️ 病历补记抽查',
      text: '因为你曾经留下过“先口头医嘱、事后补记”的痕迹，病历质控在这个月突然盯上了你。',
      rarity: 'rare',
      weight: 2,
      returnTo: 'complaint_case',
      requireFlags: ['record_shortcut'],
      options: [
        { text: '一条条补齐并接受批评', label: '稳妥', effects: { legalRisk: -6, stress: 5, health: -2 } },
        { text: '继续糊弄，先把眼前工作做完', label: '激进', effects: { stress: 3, ethics: -8, legalRisk: 12 } },
        { text: '请上级一起复盘流程，堵住后续漏洞', label: '团队协作', effects: { network: 6, legalRisk: -5, skill: 3, stress: 2 } }
      ]
    },
    {
      id: 're_forced_ai_review',
      stage: 'resident',
      title: '⚠️ AI 结果复核',
      text: '因为你之前太依赖 AI，有一份病历被系统标记为“疑似自动生成错误”。现在你得向人解释，而不是向模型解释。',
      rarity: 'rare',
      weight: 2,
      returnTo: 'promotion_gate',
      requireFlags: ['ai_overtrust'],
      options: [
        { text: '老老实实复核全部高风险病历', label: '稳妥', effects: { legalRisk: -8, stress: 5, skill: 3 } },
        { text: '把锅推给系统和流程', label: '激进', effects: { network: -4, ethics: -6, legalRisk: 10, stress: 4 } },
        { text: '顺势推动科内建立复核标准', label: '团队协作', effects: { network: 8, legalRisk: -5, ethics: 4, stress: 2 } }
      ]
    },
    {
      id: 're_forced_cost_review',
      stage: 'resident',
      title: '⚠️ 质控追问',
      text: '因为你之前把控费压得太狠，医务和医保部门开始追问：为什么一些病人明明该做的检查没做、该观察的住院日被提前切掉？',
      rarity: 'rare',
      weight: 2,
      returnTo: 'performance_review',
      requireFlags: ['over_controlled_cost'],
      options: [
        { text: '把流程补回来，承认自己之前太看重指标', label: '稳妥', effects: { ethics: 6, legalRisk: -6, money: -3, stress: 4 } },
        { text: '继续强调数据好看，赌不会深查', label: '激进', effects: { money: 4, ethics: -8, legalRisk: 10, stress: 5 } },
        { text: '联合科室一起做质量复盘', label: '团队协作', effects: { network: 6, skill: 4, legalRisk: -4, stress: 2 } }
      ]
    },
    {
      id: 're_forced_childcare_crunch',
      stage: 'resident',
      title: '⚠️ 育儿与值班撞车',
      text: '因为你开启了育儿支线，排班、托育和家里长辈的时间表终于在同一周一起失控了。',
      rarity: 'uncommon',
      weight: 3,
      returnTo: 'performance_review',
      requireFlags: ['has_child'],
      options: [
        { text: '和伴侣、家里一起重排班表', label: '团队协作', effects: { network: 5, stress: -4, money: -3, health: 2 } },
        { text: '自己硬扛，把睡眠继续切给工作', label: '激进', effects: { money: 2, stress: 8, health: -7 } },
        { text: '申请更稳的岗位或轮转安排', label: '稳妥', effects: { health: 5, stress: -5, money: -2, skill: -1 } }
      ]
    },
    {
      id: 're_forced_bigcity_rent',
      stage: 'training',
      title: '⚠️ 省会生活成本反噬',
      text: '因为你之前冲了大平台和高成本城市，租房、通勤和培训杂费开始以一种非常现实的方式追上你。',
      rarity: 'uncommon',
      weight: 3,
      returnTo: 'residency_waitlist',
      requireFlags: ['tier3_path'],
      options: [
        { text: '立刻换合租和更省钱的通勤方案', label: '稳妥', effects: { money: 9, stress: -3, health: -1 } },
        { text: '继续咬牙住得近，把时间买回来', label: '激进', effects: { money: -6, health: 3, stress: 4 } },
        { text: '和同届一起拼房拼资源', label: '团队协作', effects: { money: 6, network: 5, stress: -2 } }
      ]
    },
    {
      id: 're_forced_referral_chain',
      stage: 'training',
      title: '⚠️ 基层转诊压力',
      text: '因为你较早走上基层或连续照护路线，居民信任开始转化成真实压力：大家都来找你，你也得为每一次转诊负责。',
      rarity: 'uncommon',
      weight: 3,
      returnTo: 'grassroots_early',
      requireFlags: ['grassroots_path'],
      options: [
        { text: '建立一套自己的转诊与随访清单', label: '稳妥', effects: { skill: 4, ethics: 5, stress: 3, legalRisk: -3 } },
        { text: '能接的都接，口碑先做起来', label: '激进', effects: { network: 6, stress: 7, health: -5, money: 3 } },
        { text: '和上级医院固定对接一个协作人', label: '团队协作', effects: { network: 8, stress: -2, legalRisk: -2 } }
      ]
    }
  );

  events.push(
    {
      id: 'ending_finance_debt_loop',
      stage: 'ending',
      type: 'ending',
      title: '结局：还款表比人生规划更完整',
      text: '你没有一下子倒下，但每个月的收入、债务和利息把人生切成了更小的格子。你依然在工作，只是很多选择已经不是“想不想”，而是“还不还得起”。'
    },
    {
      id: 'ending_finance_forced_exit',
      stage: 'ending',
      type: 'ending',
      title: '结局：先活下来，再谈理想',
      text: '财务缺口终于逼得你暂停了这条高成本的医学路线。你没有被一句话打败，而是被一个个账单慢慢推出了门外。以后的人生未必更差，只是这件白大褂暂时脱下了。'
    }
  );

  walkOptionContainers((container, event) => {
    const sourceText = `因为你当年选择了“${container.text || event.title}”，现在……`;
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('questionable_research')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_research_audit', once: false, source: sourceText, preview: '可能引来学术诚信抽检' }]);
      container.consequenceHint = container.consequenceHint || '可能埋下学术诚信追问';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('record_shortcut')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_record_audit', once: false, source: sourceText, preview: '可能引来病历抽查' }]);
      container.consequenceHint = container.consequenceHint || '可能埋下病历质控问题';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('ai_overtrust')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_ai_review', once: false, source: sourceText, preview: '可能引来 AI 结果复核' }]);
      container.consequenceHint = container.consequenceHint || '可能引来 AI 复核与合规追问';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('over_controlled_cost')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_cost_review', once: false, source: sourceText, preview: '可能引来质控和医保追问' }]);
      container.consequenceHint = container.consequenceHint || '可能引来控费后果';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('has_child')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_childcare_crunch', once: false, source: sourceText, preview: '可能引来育儿与排班冲突' }]);
      container.consequenceHint = container.consequenceHint || '后续会显著增加家庭与排班压力';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('tier3_path')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_bigcity_rent', once: true, source: sourceText, preview: '可能引来高成本城市生活压力' }]);
      container.consequenceHint = container.consequenceHint || '后续生活成本会更凶';
    }
    if (Array.isArray(container.flagsSet) && container.flagsSet.includes('grassroots_path')) {
      setScheduledEvents(container, [{ delay: 2, eventId: 're_forced_referral_chain', once: true, source: sourceText, preview: '可能引来基层转诊与居民依赖压力' }]);
      container.consequenceHint = container.consequenceHint || '后续会更常遇到基层协同问题';
    }
  });


  const careerEnums = {
    undergradInstitutionTier: ['tier985'],
    graduateInstitutionTier: ['top_national', 'regional_strong', 'regular', 'diaoji'],
    degreeTrack: ['undergrad', 'masters_pro', 'masters_academic', 'phd', 'direct_work'],
    cityTier: ['mega', 'strong_province', 'prefecture', 'county_rural'],
    hospitalTier: ['top_tier3', 'regular_tier3', 'prefecture_tier3_strong2', 'regular_tier2', 'county_basic', 'premium_private', 'international'],
    hospitalType: ['public_general', 'public_specialist', 'grassroots', 'private', 'international', 'academic_research', 'industry'],
    careerTitle: ['trainee', 'resident', 'attending', 'associate_chief', 'chief', 'dept_head']
  };

  const careerDisplayNames = {
    undergradInstitutionTier: { tier985: '985医学院本科' },
    graduateInstitutionTier: { top_national: '全国头部平台', regional_strong: '区域强校', regular: '普通院校', diaoji: '调剂平台' },
    degreeTrack: { undergrad: '本科', masters_pro: '专业型硕士', masters_academic: '学术型硕士', phd: '博士/直博', direct_work: '直接就业' },
    cityTier: { mega: '超大城市', strong_province: '强省会/区域中心', prefecture: '普通地级市', county_rural: '县域/基层' },
    hospitalTier: { top_tier3: '全国头部/强三甲', regular_tier3: '省会普通三甲', prefecture_tier3_strong2: '地市中心/强二甲', regular_tier2: '普通二级医院', county_basic: '县域/基层医院', premium_private: '高端私立/连锁专科', international: '国际部/高端医疗' },
    hospitalType: { public_general: '公立综合医院', public_specialist: '公立专科医院', grassroots: '基层医疗机构', private: '民营医院', international: '国际部/高端医疗', academic_research: '科研教学单位', industry: '医疗产业相关' },
    careerTitle: { trainee: '规培医师', resident: '住院医师', attending: '主治医师', associate_chief: '副主任医师', chief: '主任医师', dept_head: '科室负责人' }
  };

  function mergeCareer(container, career) {
    if (!container || !career) return container;
    container.career = { ...(container.career || {}), ...career };
    return container;
  }

  function setCareerOnOption(eventId, index, career) {
    const event = findEvent(eventId);
    if (!event?.options?.[index]) return;
    mergeCareer(event.options[index], career);
  }

  function setCareerOnBranch(eventId, index, branchName, career) {
    const event = findEvent(eventId);
    const branch = event?.options?.[index]?.check?.[branchName];
    if (!branch) return;
    mergeCareer(branch, career);
  }

  setCareerOnOption('mentor_choice', 3, { degreeTrack: 'direct_work', graduateInstitutionTier: null, careerTitle: 'trainee' });
  setCareerOnBranch('recommendation_panel', 0, 'success', { graduateInstitutionTier: 'regional_strong', degreeTrack: 'masters_academic' });
  setCareerOnBranch('recommendation_panel', 1, 'success', { graduateInstitutionTier: 'regional_strong', degreeTrack: 'masters_academic' });
  setCareerOnBranch('entrance_exam_prep', 0, 'success', { graduateInstitutionTier: 'regional_strong', degreeTrack: 'masters_pro' });
  setCareerOnBranch('entrance_exam_prep', 1, 'success', { graduateInstitutionTier: 'top_national', degreeTrack: 'phd' });
  setCareerOnBranch('entrance_exam_prep', 2, 'success', { graduateInstitutionTier: 'regional_strong', degreeTrack: 'masters_pro' });
  setCareerOnBranch('license_exam_prep', 0, 'success', { careerTitle: 'trainee' });
  setCareerOnBranch('license_exam_prep', 1, 'success', { careerTitle: 'trainee' });
  setCareerOnBranch('license_exam_prep', 2, 'success', { careerTitle: 'trainee' });
  setCareerOnBranch('license_exam_prep', 3, 'success', { careerTitle: 'trainee' });

  const gradWaitingYear = findEvent('grad_waiting_year');
  if (gradWaitingYear) {
    gradWaitingYear.yearDelta = 0;
    gradWaitingYear.text = '调剂系统、普通院校补录、二战群与招聘会同时向你招手。你不只是决定“上不上岸”，而是在决定未来平台、专业边界与人生节奏。';
    gradWaitingYear.options = [
      {
        text: '接受调剂：先保住医学赛道，但接受热门方向名额受限',
        label: '稳妥',
        target: 'grad_admission',
        effects: { skill: 6, research: 3, stress: 4 },
        flagsSet: ['adjusted_specialty'],
        career: { graduateInstitutionTier: 'diaoji', degreeTrack: 'masters_pro' },
        consequenceHint: '后续定科时，部分热门方向会显示调剂平台限制'
      },
      {
        text: '接受普通院校补录，换一个节奏把学位读完',
        label: '均衡',
        target: 'grad_admission',
        effects: { health: 4, stress: -2, skill: 4, research: 4 },
        career: { graduateInstitutionTier: 'regular', degreeTrack: 'masters_academic' }
      },
      {
        text: '二战一年，继续冲更高平台',
        label: '激进',
        target: 'entrance_exam_prep',
        yearDelta: 1,
        effects: { stress: 12, skill: 8, money: -12, health: -5 }
      },
      {
        text: '直接就业：先拿执医、先去医院，把学位放到以后再说',
        label: '长期主义',
        target: 'license_exam_prep',
        effects: { money: 8, skill: 7, stress: 2 },
        flagsSet: ['direct_training'],
        career: { graduateInstitutionTier: null, degreeTrack: 'direct_work', careerTitle: 'trainee' }
      }
    ];
  }

  const licenseExamResult = findEvent('license_exam_result');
  if (licenseExamResult) {
    licenseExamResult.options.push({
      text: '如果前面已经签了就业/定向协议，直接进入正式定岗选择',
      label: '稳妥',
      safeChoice: true,
      target: 'hospital_job_application',
      effects: { stress: -3, network: 4 },
      conditions: { requireFlags: ['direct_training'] }
    });
  }

  const hospitalJobApplication = {
    id: 'hospital_job_application',
    stage: 'training',
    major: true,
    title: '正式求职：选择执业医院',
    text: '规培结束，执医在手。你的第一份正式工作选择，将决定未来十年的起点：城市、平台、工作强度与晋升空间，每一项都不一样。',
    yearDelta: 0,
    options: [
      {
        text: '冲头部强三甲：赌平台天花板，也赌自己能扛住密度',
        label: '激进',
        riskyChoice: true,
        effects: { skill: 8, research: 5, stress: 10, health: -4 },
        flagsSet: ['tier3_path'],
        check: {
          baseChance: 42,
          stats: { skill: 0.35, research: 0.25, network: 0.25, stress: -0.25 },
          minChance: 18,
          maxChance: 82,
          success: {
            target: 'specialty_direction_choice',
            effects: { skill: 10, network: 8, stress: 6 },
            feedback: '你拿到了头部强三甲的 offer，代价是高密度竞争从此成为日常。',
            log: '判定成功（求职）：你冲进了头部强三甲平台。',
            career: { cityTier: 'mega', hospitalTier: 'top_tier3', hospitalType: 'public_general', careerTitle: 'resident' }
          },
          failure: {
            target: 'hospital_tier_fallback',
            effects: { stress: 10, health: -4, network: 3 },
            feedback: '简历进了终面，但最终名额还是给了更亮眼的人。',
            log: '判定失败（求职）：头部强三甲没有给你留下位置。',
            flagsSet: ['failed_top_hospital_application']
          }
        }
      },
      {
        text: '省会普通三甲：平台够用，也尽量给生活留余地',
        label: '均衡',
        effects: { skill: 6, network: 4, stress: 4 },
        check: {
          baseChance: 68,
          stats: { skill: 0.25, network: 0.2, ethics: 0.15, stress: -0.2 },
          minChance: 45,
          maxChance: 90,
          success: {
            target: 'specialty_direction_choice',
            effects: { skill: 8, money: 5, stress: -3 },
            feedback: '你在省会普通三甲站稳了第一份正式岗位。',
            log: '判定成功（求职）：你进入了省会普通三甲。',
            career: { cityTier: 'strong_province', hospitalTier: 'regular_tier3', hospitalType: 'public_general', careerTitle: 'resident' }
          },
          failure: {
            target: 'hospital_tier_fallback',
            effects: { stress: 6, money: -3 },
            feedback: '这一轮岗位收紧得比往年更快，你需要及时降一个目标。',
            log: '判定失败（求职）：省会普通三甲岗位收紧，你只能重新评估。'
          }
        }
      },
      {
        text: '地市中心医院：稳妥起步，争取更早拿到独立空间',
        label: '稳妥',
        safeChoice: true,
        effects: { health: 5, stress: -4, skill: 6 },
        check: {
          baseChance: 82,
          stats: { skill: 0.2, ethics: 0.15, health: 0.15, stress: -0.15 },
          minChance: 62,
          maxChance: 95,
          success: {
            target: 'specialty_direction_choice',
            effects: { skill: 8, money: 6, stress: -4 },
            feedback: '地市中心医院愿意给你岗位，也愿意比较早放手让你成长。',
            log: '判定成功（求职）：你在地市中心医院拿到了不错的起点。',
            career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general', careerTitle: 'resident' }
          },
          failure: {
            target: 'hospital_tier_fallback',
            effects: { stress: 4, network: 3 },
            feedback: '编制和岗位临时缩紧，但你仍有别的窗口。',
            log: '判定失败（求职）：稳妥目标也开始卷起来了。'
          }
        }
      },
      {
        text: '县域/基层龙头：赌长期主义，换更快的话语权和更低生活成本',
        label: '长期主义',
        target: 'specialty_direction_choice',
        effects: { money: 10, health: 6, stress: -6, ethics: 6, skill: 4 },
        flagsSet: ['grassroots_path', 'community_trust'],
        career: { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots', careerTitle: 'resident' }
      },
      {
        text: '民营/高端私立：用专业能力换更灵活的收入与赛道',
        label: '灵活',
        effects: { money: 8, network: 6, stress: 3 },
        conditions: { anyStats: [{ research: { min: 30 } }, { ethics: { min: 60 } }] },
        check: {
          baseChance: 60,
          stats: { research: 0.25, network: 0.3, ethics: 0.2, stress: -0.15 },
          minChance: 36,
          maxChance: 88,
          success: {
            target: 'specialty_direction_choice',
            effects: { money: 10, stress: -4, skill: 5 },
            feedback: '高端私立看重你的履历与沟通能力，愿意给你更灵活的 package。',
            log: '判定成功（求职）：你切进了高端私立/连锁专科赛道。',
            career: { cityTier: 'strong_province', hospitalTier: 'premium_private', hospitalType: 'private', careerTitle: 'resident' }
          },
          failure: {
            target: 'hospital_tier_fallback',
            effects: { stress: 5, ethics: 2 },
            feedback: '民营高端岗位更看重成熟履历，你暂时还差半步。',
            log: '判定失败（求职）：高端私立岗位要求比你想得更苛刻。'
          }
        }
      }
    ]
  };

  const hospitalTierFallback = {
    id: 'hospital_tier_fallback',
    stage: 'training',
    title: '求职降级选择',
    text: '头部医院的竞争比你预期更激烈。这一年的机会窗口已经过去，你必须重新评估目标。',
    yearDelta: 0,
    options: [
      {
        text: '改投省会普通三甲，先保住城市与平台',
        label: '均衡',
        target: 'specialty_direction_choice',
        effects: { stress: -3, network: 4, skill: 4 },
        career: { cityTier: 'strong_province', hospitalTier: 'regular_tier3', hospitalType: 'public_general', careerTitle: 'resident' }
      },
      {
        text: '直接去地市中心医院，把成长速度放在第一位',
        label: '稳妥',
        safeChoice: true,
        target: 'specialty_direction_choice',
        effects: { health: 4, stress: -5, skill: 5 },
        career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general', careerTitle: 'resident' }
      },
      {
        text: '先去基层，明年再战更高平台',
        label: '长期主义',
        target: 'specialty_direction_choice',
        effects: { money: 8, ethics: 6, stress: -4, skill: 4 },
        flagsSet: ['grassroots_path'],
        career: { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots', careerTitle: 'resident' }
      },
      {
        text: '尝试民营/国际部，把第一份正式岗位先拿下来',
        label: '团队协作',
        target: 'specialty_direction_choice',
        effects: { money: 8, network: 5, stress: 2 },
        career: { cityTier: 'strong_province', hospitalTier: 'premium_private', hospitalType: 'private', careerTitle: 'resident' }
      }
    ]
  };

  const careerMobilityWindow = {
    id: 'career_mobility_window',
    stage: 'resident',
    major: true,
    title: '职业流动窗口',
    text: '随着你积累了一定临床经验，一些新的职业路口出现了。从平台到城市，从公立到私立，从大城市到小地方当大主任——每个方向都有它的逻辑。',
    yearDelta: 0,
    options: [
      {
        text: '从大城市顶尖医院转去省会普通三甲，换取生活平衡',
        label: '均衡',
        target: 'promotion_gate',
        effects: { stress: -7, health: 6, money: -2, skill: 3 },
        conditions: { requireCityTier: ['mega'], requireHospitalTier: ['top_tier3'] },
        career: { cityTier: 'strong_province', hospitalTier: 'regular_tier3', hospitalType: 'public_general', careerTitle: 'resident' }
      },
      {
        text: '从大城市去地市/县域龙头医院，争取科室骨干或负责人岗位',
        label: '长期主义',
        target: 'career_mobility_county_chief',
        effects: { network: 8, ethics: 6, stress: -4, money: 8 },
        conditions: { requireCityTier: ['mega', 'strong_province'] },
        career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general', careerTitle: 'associate_chief' }
      },
      {
        text: '从公立医院转去高端私立/国际部',
        label: '团队协作',
        target: 'career_mobility_private',
        effects: { money: 14, network: 8, stress: -2, ethics: -2 },
        conditions: { forbidHospitalTier: ['premium_private', 'international'], stats: { ethics: { min: 60 } } },
        career: { cityTier: 'strong_province', hospitalTier: 'premium_private', hospitalType: 'private', careerTitle: 'attending' }
      },
      {
        text: '从普通医院再冲更高层级平台',
        label: '激进',
        effects: { skill: 8, research: 6, stress: 8, health: -4 },
        conditions: { requireHospitalTier: ['regular_tier3', 'prefecture_tier3_strong2', 'regular_tier2', 'county_basic'], stats: { skill: { min: 65 }, research: { min: 45 } } },
        check: {
          baseChance: 52,
          stats: { skill: 0.3, research: 0.25, network: 0.2, stress: -0.2 },
          minChance: 24,
          maxChance: 86,
          success: {
            target: 'promotion_gate',
            effects: { network: 8, stress: -3, skill: 6 },
            feedback: '你靠几年积累重新撬开了更高层级的平台。',
            log: '判定成功（流动）：你完成了平台跃迁。',
            career: { cityTier: 'mega', hospitalTier: 'top_tier3', hospitalType: 'public_general', careerTitle: 'resident' }
          },
          failure: {
            target: 'promotion_gate',
            effects: { stress: 10, health: -4 },
            feedback: '简历被认真看过，但这次还不足以完成向上跳。',
            log: '判定失败（流动）：更高平台没有立刻接住你。'
          }
        }
      },
      {
        text: '继续原来的路，暂不跳槽',
        label: '稳妥',
        safeChoice: true,
        target: 'promotion_gate',
        effects: { stress: -5, ethics: 3 }
      }
    ]
  };

  const careerMobilityPrivate = {
    id: 'career_mobility_private',
    stage: 'senior',
    title: '高端私立 / 国际部的新剧本',
    text: '新的平台不再只看疑难重症处理速度，也看服务体验、沟通、合规与转诊协同。你得决定，要做哪一种核心人物。',
    yearDelta: 1,
    options: [
      {
        text: '守住服务与合规，做高端私立的稳定骨干',
        label: '稳妥',
        safeChoice: true,
        target: 'ending_premium_private_expert',
        effects: { money: 18, stress: -6, ethics: 6, network: 6 },
        career: { hospitalTier: 'premium_private', hospitalType: 'private', careerTitle: 'attending' }
      },
      {
        text: '转去国际部/高端医疗，主打双语沟通与长期管理',
        label: '均衡',
        target: 'ending_premium_private_expert',
        effects: { money: 16, network: 8, stress: -4, skill: 4 },
        career: { hospitalTier: 'international', hospitalType: 'international', careerTitle: 'attending', cityTier: 'mega' }
      },
      {
        text: '保留转诊与教学合作，做区域高端医疗网络枢纽',
        label: '团队协作',
        target: 'ending_regional_backbone',
        effects: { network: 12, ethics: 5, money: 10, stress: 2 },
        career: { hospitalTier: 'premium_private', hospitalType: 'private', careerTitle: 'associate_chief' }
      }
    ]
  };

  const careerMobilityCountyChief = {
    id: 'career_mobility_county_chief',
    stage: 'senior',
    title: '地方平台的上升窗口',
    text: '小地方并不意味着小人生。资源更紧，但学科建设、带教、转诊网络和个人影响力都更直接地落在你身上。',
    yearDelta: 1,
    options: [
      {
        text: '接下县域龙头医院科室负责人岗位',
        label: '长期主义',
        target: 'ending_county_dept_head',
        effects: { network: 10, ethics: 8, money: 10, stress: 4 },
        career: { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots', careerTitle: 'dept_head' }
      },
      {
        text: '留在地市中心做区域三甲骨干，先把亚专科做起来',
        label: '均衡',
        target: 'ending_regional_backbone',
        effects: { skill: 10, network: 8, stress: 3, money: 6 },
        career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_specialist', careerTitle: 'associate_chief' }
      },
      {
        text: '接受返乡人才引进计划，把资源和口碑带回家乡',
        label: '稳妥',
        safeChoice: true,
        target: 'ending_talent_return',
        effects: { ethics: 12, network: 8, health: 6, money: 5 },
        flagsSet: ['community_trust'],
        career: { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'public_general', careerTitle: 'dept_head' }
      }
    ]
  };

  insertEventAfter('drg_bootcamp', hospitalJobApplication);
  insertEventAfter('hospital_job_application', hospitalTierFallback);
  insertEventAfter('ai_and_online', careerMobilityWindow);
  insertEventAfter('career_mobility_window', careerMobilityPrivate);
  insertEventAfter('career_mobility_private', careerMobilityCountyChief);

  const drgBootcampUpdated = findEvent('drg_bootcamp');
  for (const option of drgBootcampUpdated?.options || []) {
    if (option.target === 'specialty_direction_choice' || option.target === 'night_shift_call') {
      option.target = 'hospital_job_application';
      mergeCareer(option, { careerTitle: 'trainee' });
    }
  }

  const grassrootsEarly = findEvent('grassroots_early');
  for (const option of grassrootsEarly?.options || []) {
    mergeCareer(option, { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots', careerTitle: 'trainee' });
  }

  setCareerOnBranch('residency_match', 0, 'success', { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general', careerTitle: 'trainee' });
  setCareerOnBranch('residency_match', 1, 'success', { cityTier: 'strong_province', hospitalTier: 'regular_tier3', hospitalType: 'public_general', careerTitle: 'trainee' });
  setCareerOnOption('residency_match', 2, { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots', careerTitle: 'trainee' });
  setCareerOnBranch('residency_match', 3, 'success', { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general', careerTitle: 'trainee' });

  setCareerOnBranch('promotion_gate', 0, 'success', { careerTitle: 'attending' });
  setCareerOnBranch('promotion_gate', 2, 'success', { careerTitle: 'attending' });
  setCareerOnBranch('chief_competition', 0, 'success', { careerTitle: 'associate_chief' });
  setCareerOnBranch('chief_competition', 1, 'success', { careerTitle: 'chief' });
  setCareerOnBranch('chief_competition', 2, 'success', { careerTitle: 'associate_chief' });

  const aiAndOnline = findEvent('ai_and_online');
  for (const option of aiAndOnline?.options || []) {
    if (option.target === 'promotion_gate') option.target = 'career_mobility_window';
  }

  events.push(
    {
      id: 'ending_county_dept_head',
      stage: 'ending',
      type: 'ending',
      title: '结局：县域/地市科室负责人',
      text: '你没有留在最耀眼的平台，却在更需要人的地方把一个科室真正带了起来。患者认识你，年轻医生也开始照着你的标准做事。'
    },
    {
      id: 'ending_premium_private_expert',
      stage: 'ending',
      type: 'ending',
      title: '结局：高端私立 / 国际医疗骨干',
      text: '你在新的医疗服务体系里找到了自己的位置。节奏、收入与患者关系都改写了，但你的专业判断依然是最硬的底牌。'
    },
    {
      id: 'ending_regional_backbone',
      stage: 'ending',
      type: 'ending',
      title: '结局：区域三甲临床骨干',
      text: '你不一定在全国最顶尖的平台，却成为区域内最值得信赖的那批医生。复杂病例、教学查房和跨院协作里，总有人第一个想到你。'
    },
    {
      id: 'ending_talent_return',
      stage: 'ending',
      type: 'ending',
      title: '结局：返乡人才引进',
      text: '你把一路学到的东西带回了家乡。这里资源不如大城市充裕，但你让更多人第一次在本地就看到了更好的医疗可能。'
    }
  );

  const contextRandomEvents = [
    { id: 're_985_research_competition', stage: 'undergrad', title: '🎲 本科科研竞赛机会', text: '学院把一个高含金量的大学生医学创新竞赛名额放到了年级群里。你知道，985 里的机会从来和竞争绑在一起。', returnTo: 'clerkship_intro', conditions: { requireUndergradTier: ['tier985'] }, options: [{ text: '咬牙报名，拿周末换成果', label: '激进', effects: { research: 8, stress: 6, health: -3 } }, { text: '找老师和学长组队，稳扎稳打准备', label: '团队协作', effects: { research: 6, network: 6, stress: 2 } }] },
    { id: 're_985_affiliated_hospital_shadowing', stage: 'undergrad', title: '🎲 附属强三甲见习', text: '附属医院开放了一批见习旁听位。老师说，真正的临床节奏，站进去才知道。', returnTo: 'clerkship_intro', conditions: { requireUndergradTier: ['tier985'] }, options: [{ text: '抢最忙的科室去看真实节奏', label: '激进', effects: { skill: 8, stress: 5, health: -3 } }, { text: '选带教口碑好的老师，先把观察做扎实', label: '稳妥', effects: { skill: 6, ethics: 4, network: 4 } }] },
    { id: 're_985_peer_pressure_ranking', stage: 'undergrad', title: '🎲 同辈排名竞争', text: '年级排名悄悄流传出来，周围人看上去都比你更早、更快、更会规划。', returnTo: 'biochem_week', conditions: { requireUndergradTier: ['tier985'] }, options: [{ text: '把压力转成计划，重新安排学习节奏', label: '长期主义', effects: { skill: 7, stress: 5 } }, { text: '先停一下，别让比较毁掉自己', label: '休息', effects: { health: 6, stress: -8, ethics: 2 } }] },
    { id: 're_985_graduate_mentor_fair', stage: 'undergrad', title: '🎲 研究生导师招募展', text: '几位附院导师来学院做宣讲，PPT 上写着“平台、论文、留院机会”。', returnTo: 'mentor_choice', conditions: { requireUndergradTier: ['tier985'] }, options: [{ text: '主动去聊，尽早让导师记住你', label: '团队协作', effects: { network: 7, research: 4, stress: 2 } }, { text: '先记下方向，回去评估自己适不适合', label: '均衡', effects: { skill: 4, research: 4, stress: -2 } }] },
    { id: 're_985_scholarship_competition', stage: 'undergrad', title: '🎲 985 奖学金竞争', text: '奖学金名单前的安静，比任何讨论都更让人紧张。', returnTo: 'campus_meme_night', conditions: { requireUndergradTier: ['tier985'] }, options: [{ text: '复盘综合测评，把每个加分点都做细', label: '长期主义', effects: { money: 6, skill: 5, stress: 3 } }, { text: '告诉自己别被奖学金定义价值', label: '休息', effects: { health: 5, stress: -6, ethics: 3 } }] },

    { id: 're_topgrad_elite_supervisor', stage: 'graduate', title: '🎲 强导师的高要求', text: '导师的消息总在深夜发来，而且默认你会在第二天早上把方案改好。头部平台的资源从不白给。', returnTo: 'paper_deadline', conditions: { requireGraduateTier: ['top_national'] }, options: [{ text: '顶住节奏，把要求拆成可执行任务', label: '长期主义', effects: { research: 8, stress: 6, health: -3 } }, { text: '主动约导师面谈，争取更清晰的预期', label: '团队协作', effects: { network: 6, research: 5, stress: 2 } }] },
    { id: 're_topgrad_top_lab', stage: 'graduate', title: '🎲 顶级课题组资源', text: '你第一次在组会上听见“这个样本我们和全国多中心一起做”。平台差距，被摆在了最具体的地方。', returnTo: 'lab_entry', conditions: { requireGraduateTier: ['top_national'] }, options: [{ text: '主动扛一个核心子课题', label: '激进', effects: { research: 9, stress: 6, network: 3 } }, { text: '先把协作流程学懂，别浪费平台资源', label: '稳妥', effects: { research: 6, skill: 3, ethics: 3 } }] },
    { id: 're_topgrad_paper_pressure', stage: 'graduate', title: '🎲 顶级期刊投稿压力', text: '同门讨论的不是能不能发，而是发在哪个分区。你知道这会慢慢改写对“合格”的定义。', returnTo: 'paper_deadline', conditions: { requireGraduateTier: ['top_national'] }, options: [{ text: '按高标准磨数据和表达', label: '长期主义', effects: { research: 8, stress: 7 } }, { text: '给自己设一道底线，别被比较拖垮', label: '稳妥', effects: { health: 4, stress: -5, ethics: 2 } }] },
    { id: 're_topgrad_stay_competition', stage: 'graduate', title: '🎲 留院 / 留所竞争', text: '越是头部平台，留院名额越像最后一道暗门。老师不明说，但每个人都在算。', returnTo: 'conference_choice', conditions: { requireGraduateTier: ['top_national'] }, options: [{ text: '把临床、科研和表达一起补齐', label: '激进', effects: { skill: 5, research: 7, stress: 6 } }, { text: '同时准备外部平台，别把人生押一处', label: '均衡', effects: { network: 6, stress: -2, money: 2 } }] },
    { id: 're_topgrad_international_conf', stage: 'graduate', title: '🎲 国际会议机会', text: '课题组拿到一个国际会议壁报名额。真正稀缺的不是出国，而是被看见。', returnTo: 'conference_choice', conditions: { requireGraduateTier: ['top_national'] }, options: [{ text: '去现场讲，逼自己站上更大的讨论场', label: '激进', effects: { network: 8, research: 6, money: -6, stress: 4 } }, { text: '线上参与，把预算留给后续实验', label: '稳妥', effects: { research: 4, money: 3, stress: -2 } }] },

    { id: 're_diaoji_specialty_limit', stage: 'graduate', title: '🎲 专业选择受限', text: '调剂名单出来后，你发现能选的导师与方向比想象中窄得多。不是不能走，只是路变细了。', returnTo: 'grad_admission', conditions: { requireGraduateTier: ['diaoji', 'regular'] }, options: [{ text: '先接受现实，把能做的资源用到极致', label: '稳妥', effects: { skill: 5, ethics: 3, stress: 2 } }, { text: '主动找临床轮转机会，补足平台短板', label: '激进', effects: { network: 5, skill: 6, stress: 4 } }] },
    { id: 're_diaoji_resource_gap', stage: 'graduate', title: '🎲 导师资源差异', text: '同样读研，有人的实验平台像机场，有人的像临时拼起来的转运站。差距肉眼可见。', returnTo: 'lab_entry', conditions: { requireGraduateTier: ['diaoji', 'regular'] }, options: [{ text: '把有限资源排出优先级，别白耗', label: '长期主义', effects: { research: 5, stress: 3, ethics: 2 } }, { text: '跨组借设备和方法，主动补位', label: '团队协作', effects: { network: 7, research: 4, stress: 2 } }] },
    { id: 're_diaoji_proactive_clinical', stage: 'graduate', title: '🎲 主动争取临床机会', text: '平台不够强时，很多能力只能靠你自己去病房一点点抢。', returnTo: 'lab_entry', conditions: { requireGraduateTier: ['diaoji', 'regular'] }, options: [{ text: '多去门诊和病房，多看多问', label: '激进', effects: { skill: 7, stress: 5, health: -2 } }, { text: '跟着带教做记录和复盘，把每次机会吃透', label: '稳妥', effects: { skill: 5, ethics: 4, stress: 2 } }] },
    { id: 're_diaoji_alternative_advantage', stage: 'graduate', title: '🎲 发现调剂路线的优势', text: '因为人少、层级短，你反而比一些同龄人更早摸到真正的临床细节。', returnTo: 'paper_revision_year', conditions: { requireGraduateTier: ['diaoji', 'regular'] }, options: [{ text: '把这份早接触临床的优势做成口碑', label: '长期主义', effects: { skill: 7, network: 4, stress: -2 } }, { text: '顺势争取成为老师最放心带的人', label: '团队协作', effects: { network: 6, skill: 4, research: 2 } }] },
    { id: 're_diaoji_peer_comparison', stage: 'graduate', title: '🎲 和非调剂同学的比较', text: '聚餐时聊到平台和导师，有些落差不需要谁故意强调，也会自己浮上来。', returnTo: 'conference_choice', conditions: { requireGraduateTier: ['diaoji', 'regular'] }, options: [{ text: '允许失落，但把心思拉回自己的路', label: '稳妥', effects: { ethics: 3, stress: -5, health: 4 } }, { text: '把比较变成动力，补能力不补情绪', label: '激进', effects: { skill: 5, research: 4, stress: 4 } }] },

    { id: 're_mega_high_rent', stage: 'resident', title: '🎲 高房租压力', text: '银行卡提醒你，房租又涨了一点。在超大城市，住得离医院近，几乎就是在买睡眠。', returnTo: 'ward_rounds', conditions: { requireCityTier: ['mega'] }, options: [{ text: '换更远一点的房子，把现金流稳住', label: '稳妥', effects: { money: 8, stress: 3, health: -2 } }, { text: '继续住近一点，把时间从路上买回来', label: '均衡', effects: { health: 3, money: -6, stress: -2 } }] },
    { id: 're_mega_commute_grind', stage: 'resident', title: '🎲 超长通勤', text: '早高峰地铁里，你一边站着补觉，一边想今天晚上的夜班还没开始。', returnTo: 'night_shift_call', conditions: { requireCityTier: ['mega'] }, options: [{ text: '花钱换更方便的通勤方式', label: '均衡', effects: { money: -5, health: 4, stress: -3 } }, { text: '忍住通勤，把预算留给别处', label: '稳妥', effects: { money: 3, stress: 5, health: -3 } }] },
    { id: 're_mega_international_conference', stage: 'resident', title: '🎲 国际医学会议', text: '会场就在城里最贵的会展中心，来的人很多，真正能聊成的合作很少。', returnTo: 'performance_review', conditions: { requireCityTier: ['mega'] }, options: [{ text: '去认识真正相关的人，不追求面面俱到', label: '团队协作', effects: { network: 8, research: 4, money: -4 } }, { text: '只听核心专场，省时间省体力', label: '稳妥', effects: { skill: 5, stress: -2, money: -2 } }] },
    { id: 're_mega_competition_density', stage: 'resident', title: '🎲 密集竞争环境', text: '你发现身边几乎每个人都在上课、写文章、考证、争指标。这里的正常值被悄悄抬高了。', returnTo: 'performance_review', conditions: { requireCityTier: ['mega'] }, options: [{ text: '接受高标准，把自己的节奏再往前拧一点', label: '激进', effects: { skill: 6, research: 4, stress: 6 } }, { text: '只和昨天的自己比，不把自己扔进无底比较', label: '稳妥', effects: { health: 4, stress: -5, ethics: 2 } }] },
    { id: 're_mega_top_platform_access', stage: 'resident', title: '🎲 顶尖平台机会', text: '头部科室开放联合门诊、病例讨论或短期进修名额。超大城市的好处，常常就在这种信息密度里。', returnTo: 'promotion_gate', conditions: { requireCityTier: ['mega'] }, options: [{ text: '主动报名，哪怕多扛一点排班', label: '激进', effects: { skill: 8, network: 5, stress: 5 } }, { text: '挑最适合自己方向的一项去做', label: '均衡', effects: { skill: 5, research: 3, stress: 2 } }] },

    { id: 're_province_regional_network', stage: 'resident', title: '🎲 区域医疗网络资源', text: '省会平台不像全国头部那样拥挤，但上下转诊、协作会诊和区域培训体系正在给你加杠杆。', returnTo: 'ward_rounds', conditions: { requireCityTier: ['strong_province'] }, options: [{ text: '把区域协作名单记清楚，主动建立联系', label: '团队协作', effects: { network: 7, skill: 3, stress: 1 } }, { text: '先把本院的基本盘做好，再慢慢外拓', label: '稳妥', effects: { skill: 5, ethics: 3, stress: -2 } }] },
    { id: 're_province_platform_life_balance', stage: 'resident', title: '🎲 平台与生活平衡', text: '你第一次意识到，这座城市也许不是天花板最高的，但可能是长期活下去最稳的地方。', returnTo: 'performance_review', conditions: { requireCityTier: ['strong_province'] }, options: [{ text: '把生活稳定下来，换更长的续航', label: '休息', effects: { health: 7, stress: -7 } }, { text: '趁环境可控，把副高前的硬指标补齐', label: '长期主义', effects: { skill: 4, research: 4, stress: 3 } }] },
    { id: 're_province_regional_conference', stage: 'resident', title: '🎲 省级学术会议', text: '省级会没有全国会那么耀眼，但真正会成为未来协作对象的人，往往都在这里。', returnTo: 'promotion_gate', conditions: { requireCityTier: ['strong_province'] }, options: [{ text: '带着病例和问题去结识同行', label: '团队协作', effects: { network: 8, skill: 3, money: -3 } }, { text: '专注听最对口的内容，稳稳吸收', label: '稳妥', effects: { skill: 5, stress: -2 } }] },

    { id: 're_prefecture_familiar_society', stage: 'resident', title: '🎲 熟人社会关系', text: '在地市和县域，患者、同事、领导，甚至朋友的朋友，常常会在同一张关系网里相遇。', returnTo: 'patient_talk', conditions: { requireCityTier: ['prefecture', 'county_rural'] }, options: [{ text: '守住边界，把规矩说在前面', label: '稳妥', effects: { ethics: 6, legalRisk: -4, stress: 2 } }, { text: '适度讲人情，但别把底线拿去交换', label: '均衡', effects: { network: 6, stress: 2, ethics: 1 } }] },
    { id: 're_prefecture_quick_backbone', stage: 'resident', title: '🎲 快速成为科室骨干', text: '平台不算最大，但人手更缺。很多本应更晚落到你头上的事情，提前来了。', returnTo: 'ward_rounds', conditions: { requireCityTier: ['prefecture', 'county_rural'] }, options: [{ text: '接下来，把骨干位置做实', label: '长期主义', effects: { skill: 8, stress: 5, network: 4 } }, { text: '挑核心工作扛，别把自己一次耗空', label: '稳妥', effects: { health: 4, skill: 5, stress: 1 } }] },
    { id: 're_prefecture_housing_advantage', stage: 'resident', title: '🎲 住房和生活成本优势', text: '同样的收入，在这里终于能换来一套像样的居住空间和一点生活感。', returnTo: 'performance_review', conditions: { requireCityTier: ['prefecture', 'county_rural'] }, options: [{ text: '把节省下来的钱用来改善生活', label: '休息', effects: { health: 6, stress: -5, money: 4 } }, { text: '把节省下来的钱投进进修和学习', label: '长期主义', effects: { money: 2, skill: 5, research: 3 } }] },
    { id: 're_county_referral_pressure', stage: 'resident', title: '🎲 转诊边界和设备限制', text: '你知道该做的检查和治疗方案，但机器、床位和上级医院接收能力常常不配合。', returnTo: 'complaint_case', conditions: { requireCityTier: ['prefecture', 'county_rural'] }, options: [{ text: '把每次转诊理由和风险交代都写清楚', label: '稳妥', effects: { legalRisk: -5, ethics: 5, stress: 3 } }, { text: '尽量在本地先稳住，再争取转上去', label: '激进', effects: { skill: 6, stress: 6, legalRisk: 2 } }] },
    { id: 're_county_talent_program', stage: 'senior', title: '🎲 人才引进机会', text: '地方政府的人才计划把你的名字放上了讨论名单。资源未必多，但尊重与空间都很直接。', returnTo: 'senior_outcome', conditions: { requireCityTier: ['county_rural'] }, options: [{ text: '认真谈条件，把平台建设需求说清楚', label: '团队协作', effects: { network: 8, money: 6, ethics: 4 } }, { text: '先不急着接，评估家庭与职业能不能一起承受', label: '稳妥', effects: { health: 4, stress: -3, skill: 2 } }] },

    { id: 're_top3_complex_case', stage: 'resident', title: '🎲 疑难复杂病例会诊', text: '在头部强三甲，真正让人长大的，往往不是量，而是那些一屋子人都皱眉的病例。', returnTo: 'complex_case_turnaround', conditions: { requireHospitalTier: ['top_tier3'] }, options: [{ text: '主动准备病例摘要，逼自己把逻辑理顺', label: '长期主义', effects: { skill: 8, stress: 5, research: 3 } }, { text: '多听多记，把高手的取舍学回来', label: '稳妥', effects: { skill: 6, stress: 2, ethics: 2 } }] },
    { id: 're_top3_research_kpi', stage: 'resident', title: '🎲 科研考核压力', text: '临床已经很满，考核表却提醒你：头部医院从来不只考临床。', returnTo: 'performance_review', conditions: { requireHospitalTier: ['top_tier3'] }, options: [{ text: '把科研拆到每个月，慢慢补硬指标', label: '长期主义', effects: { research: 7, stress: 6, health: -2 } }, { text: '先保临床口碑，科研走稳一点的合作路线', label: '团队协作', effects: { network: 6, research: 4, stress: 2 } }] },
    { id: 're_top3_stay_competition', stage: 'resident', title: '🎲 留院晋升竞争', text: '越好的平台越不缺人，想留下来的人几乎都像在跑一场没有终点线的比赛。', returnTo: 'promotion_gate', conditions: { requireHospitalTier: ['top_tier3'] }, options: [{ text: '继续卷，把名额当成必须拿下的目标', label: '激进', effects: { skill: 6, network: 4, stress: 7 } }, { text: '同步看外部机会，别让平台定义全部价值', label: '均衡', effects: { stress: -3, network: 5, ethics: 2 } }] },
    { id: 're_top3_night_shift_density', stage: 'resident', title: '🎲 高强度夜班频率', text: '夜班表排出来后，你发现自己对“这个月有几天能完整睡觉”已经没有太大把握。', returnTo: 'night_shift_call', conditions: { requireHospitalTier: ['top_tier3'] }, options: [{ text: '硬扛，同时把值班流程练到更稳', label: '激进', effects: { skill: 6, stress: 8, health: -5 } }, { text: '主动和团队协调排班与交接', label: '团队协作', effects: { network: 6, stress: -2, health: -1 } }] },
    { id: 're_top3_multidisciplinary', stage: 'resident', title: '🎲 多学科团队会诊', text: '真正的 MDT 不只是“大家坐一起”，而是每个人都得在最短时间内给出最稳的判断。', returnTo: 'ward_rounds', conditions: { requireHospitalTier: ['top_tier3'] }, options: [{ text: '主动准备自己这一段，别在会上一问三不知', label: '稳妥', effects: { skill: 6, network: 4, stress: 3 } }, { text: '借会诊认识关键科室的人', label: '团队协作', effects: { network: 8, skill: 3, stress: 1 } }] },

    { id: 're_reg3_clinical_volume', stage: 'resident', title: '🎲 稳定临床量', text: '这里没有最顶级平台那种名声压力，但病人数足够稳定，足够把一个人慢慢练扎实。', returnTo: 'ward_rounds', conditions: { requireHospitalTier: ['regular_tier3'] }, options: [{ text: '把每个常见病都做到流程熟、质量稳', label: '稳妥', effects: { skill: 7, stress: 2, ethics: 2 } }, { text: '在稳定量里顺便补教学与论文', label: '长期主义', effects: { skill: 4, research: 5, stress: 4 } }] },
    { id: 're_reg3_regional_patient', stage: 'resident', title: '🎲 区域特色患者群体', text: '你开始熟悉这座城市真正高发、最常见、最被忽视的那批病。', returnTo: 'patient_talk', conditions: { requireHospitalTier: ['regular_tier3'] }, options: [{ text: '把本地常见问题做成自己的强项', label: '长期主义', effects: { skill: 6, ethics: 3, network: 3 } }, { text: '和基层建立随访与转诊联系', label: '团队协作', effects: { network: 7, skill: 3, stress: 1 } }] },
    { id: 're_reg3_performance_pressure', stage: 'resident', title: '🎲 绩效与稳定性', text: '这里最大的拉扯，不是能不能活下来，而是怎样在“稳定”里不变得麻木。', returnTo: 'performance_review', conditions: { requireHospitalTier: ['regular_tier3'] }, options: [{ text: '接受稳态，把每年都做成可积累的一年', label: '稳妥', effects: { health: 4, stress: -4, skill: 4 } }, { text: '主动给自己加一点项目和突破口', label: '激进', effects: { research: 4, network: 4, stress: 4 } }] },

    { id: 're_lower_hospital_independent_op', stage: 'resident', title: '🎲 更早独立操作机会', text: '在资源和人手都更紧的地方，你比同龄人更早被推到了独立承担的边缘。', returnTo: 'complex_case_turnaround', conditions: { requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] }, options: [{ text: '抓住机会，但把每一步都做成可回看', label: '长期主义', effects: { skill: 8, stress: 4, legalRisk: -1 } }, { text: '遇到不确定就多请示，别把早上手变成早翻车', label: '稳妥', effects: { skill: 5, network: 4, legalRisk: -3 } }] },
    { id: 're_lower_hospital_equipment_limit', stage: 'resident', title: '🎲 设备与资源限制', text: '你不缺判断，缺的是马上能用的设备、床位和备用方案。', returnTo: 'complaint_case', conditions: { requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] }, options: [{ text: '把资源边界和患者预期都讲清楚', label: '稳妥', effects: { ethics: 5, legalRisk: -4, stress: 2 } }, { text: '尽量用现有条件多扛一步', label: '激进', effects: { skill: 6, stress: 5, legalRisk: 2 } }] },
    { id: 're_lower_hospital_talent_recruit', stage: 'senior', title: '🎲 医院人才引进压力', text: '领导开始问你：能不能带人、能不能把学科做起来、能不能别让好苗子又流回大城市。', returnTo: 'senior_outcome', conditions: { requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] }, options: [{ text: '认真带教，先把梯队留住', label: '长期主义', effects: { network: 8, ethics: 5, stress: 4 } }, { text: '先争取资源，不然留不住人也做不成事', label: '团队协作', effects: { network: 9, money: 4, stress: 3 } }] },

    { id: 're_private_service_expectation', stage: 'resident', title: '🎲 患者服务体验要求', text: '在高端私立，患者期待的不只是不出错，还包括流程、解释、回应速度和“被重视”的感觉。', returnTo: 'patient_talk', conditions: { requireHospitalTier: ['premium_private', 'international'] }, options: [{ text: '把沟通做细，让专业和体验一起成立', label: '稳妥', effects: { ethics: 5, network: 4, stress: 2 } }, { text: '先把医疗质量扛住，其他交给团队', label: '团队协作', effects: { skill: 5, network: 5, stress: 1 } }] },
    { id: 're_private_contract_performance', stage: 'resident', title: '🎲 合同绩效压力', text: '这里没有编制焦虑，但合同指标会用另一种方式告诉你：任何自由都不是没有代价。', returnTo: 'performance_review', conditions: { requireHospitalTier: ['premium_private', 'international'] }, options: [{ text: '按节奏完成指标，别把服务做成透支', label: '稳妥', effects: { money: 8, stress: 3, health: -1 } }, { text: '主动争取更多项目和病人，拉高收入线', label: '激进', effects: { money: 12, stress: 6, health: -3 } }] },
    { id: 're_private_language_communication', stage: 'resident', title: '🎲 语言 / 国际沟通', text: '病人问得更细、资料更全、背景更多元，你发现“会不会解释”在这里和“会不会做”一样重要。', returnTo: 'ward_rounds', conditions: { requireHospitalTier: ['premium_private', 'international'] }, options: [{ text: '补沟通与英文表达，让自己更适配这套场域', label: '长期主义', effects: { network: 6, skill: 4, stress: 3 } }, { text: '依靠团队分工，把自己最强的专业部分做好', label: '团队协作', effects: { skill: 5, network: 5, stress: -1 } }] },
    { id: 're_private_insurance_compliance', stage: 'resident', title: '🎲 保险审核与合规', text: '病人、医院和保险方的期待并不总是一致。写病历时，你开始更频繁地想到“可解释性”这个词。', returnTo: 'complaint_case', conditions: { requireHospitalTier: ['premium_private', 'international'] }, options: [{ text: '按合规要求把证据链写扎实', label: '稳妥', effects: { legalRisk: -6, stress: 3, ethics: 3 } }, { text: '先满足患者，再想办法补文件', label: '激进', effects: { ethics: 2, legalRisk: 4, stress: 4 } }] },
    { id: 're_private_income_advantage', stage: 'resident', title: '🎲 收入优势体验', text: '第一次发薪时，你确实感受到赛道差异。但你也知道，这份差异永远伴随着平台逻辑。', returnTo: 'performance_review', conditions: { requireHospitalTier: ['premium_private', 'international'] }, options: [{ text: '把多出来的收入换成更稳的生活缓冲', label: '稳妥', effects: { money: 10, stress: -3, health: 3 } }, { text: '继续冲更高绩效，把窗口吃满', label: '激进', effects: { money: 14, stress: 5, ethics: -2 } }] },

    { id: 're_sp_pediatrics_top_complex', stage: 'resident', title: '🎲 儿科头部中心的疑难重症', text: '大平台儿科收进来的，往往都不是只打一针就能回家的孩子。家属焦虑和病情复杂一起上来了。', returnTo: 'complex_case_turnaround', conditions: { specialty: 'pediatrics', requireHospitalTier: ['top_tier3'] }, options: [{ text: '把评估和沟通都做得更细', label: '稳妥', effects: { skill: 7, ethics: 5, stress: 4 } }, { text: '主动跟上级争取参与核心处置', label: '激进', effects: { skill: 9, stress: 6, health: -2 } }] },
    { id: 're_sp_pediatrics_county_surge', stage: 'resident', title: '🎲 儿科在地市 / 县域的季节性高峰', text: '流感季一来，门急诊像突然涨潮。没有多的人手，只有更多的家长。', returnTo: 'night_shift_call', conditions: { specialty: 'pediatrics', requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] }, options: [{ text: '先把分诊和宣教流程拉起来', label: '团队协作', effects: { network: 6, ethics: 4, stress: 3 } }, { text: '自己多顶几班，先把高峰扛过去', label: '激进', effects: { skill: 6, stress: 7, health: -4 } }] },
    { id: 're_sp_surgery_subspecialty', stage: 'resident', title: '🎲 外科在大平台的亚专科压力', text: '在大平台，连“外科”都只是起点。真正的竞争来自更细的亚专科和更长的培养链。', returnTo: 'ward_rounds', conditions: { specialty: 'surgery', requireHospitalTier: ['top_tier3', 'regular_tier3'] }, options: [{ text: '尽快选准亚方向，别在大平台里发散', label: '长期主义', effects: { skill: 8, research: 3, stress: 4 } }, { text: '先把基本盘做厚，再决定细分', label: '稳妥', effects: { skill: 6, stress: 2, ethics: 2 } }] },
    { id: 're_sp_surgery_county_pioneer', stage: 'resident', title: '🎲 外科在小地方更早主刀', text: '在小地方，很多手术没有更多人替你上。成长很快，责任也很快。', returnTo: 'complex_case_turnaround', conditions: { specialty: 'surgery', requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] }, options: [{ text: '每台术前都做足准备，慢一点也值', label: '稳妥', effects: { skill: 7, legalRisk: -3, stress: 3 } }, { text: '多接台，尽快把自己的主刀线拉起来', label: '激进', effects: { skill: 9, stress: 6, health: -3 } }] },
    { id: 're_sp_radiology_ai_big', stage: 'resident', title: '🎲 影像在大平台的 AI 与科研', text: 'AI 在大平台不是新闻，而是日常。真正的区别在于：你能不能判断模型什么时候不该被信。', returnTo: 'ai_and_online', conditions: { specialty: 'imaging_ultrasound', requireHospitalTier: ['top_tier3', 'regular_tier3'] }, options: [{ text: '把 AI 当二读工具，提升准确性', label: '稳妥', effects: { skill: 7, research: 4, legalRisk: -3 } }, { text: '主动做 AI 相关科研，争取更高平台认知度', label: '激进', effects: { research: 8, stress: 4, network: 3 } }] },
    { id: 're_sp_radiology_rural_shortage', stage: 'resident', title: '🎲 影像在基层的人手短缺', text: '机器未必少，真正缺的是能看、能写、能解释的人。你开始被更多科室同时盯着。', returnTo: 'ward_rounds', conditions: { specialty: 'imaging_ultrasound', requireHospitalTier: ['regular_tier2', 'county_basic'] }, options: [{ text: '建立模板和优先级，先把周转稳住', label: '稳妥', effects: { skill: 6, stress: 3, network: 2 } }, { text: '主动承担更多会诊，尽快把自己做成关键节点', label: '激进', effects: { skill: 8, stress: 5, health: -2 } }] },
    { id: 're_sp_psychiatry_stigma', stage: 'resident', title: '🎲 精神科的社会偏见', text: '有些病人家属悄悄问你：“是不是别让别人知道挂了这个科？”专业之外的偏见，落到了你面前。', returnTo: 'patient_talk', conditions: { specialty: 'psychiatry' }, options: [{ text: '把解释做得更耐心，先接住羞耻感', label: '稳妥', effects: { ethics: 7, stress: 3, network: 2 } }, { text: '主动做科普，把误解往前推一寸', label: '长期主义', effects: { network: 6, ethics: 5, stress: 4 } }] },
    { id: 're_sp_gp_chronic_disease', stage: 'resident', title: '🎲 全科在基层的慢病管理', text: '复诊名单一长串地排开来，你逐渐明白，全科的难不在惊险，而在年复一年把每个细节都做对。', returnTo: 'ward_rounds', conditions: { specialty: 'general_practice', requireHospitalTier: ['county_basic', 'regular_tier2'] }, options: [{ text: '做随访台账，把长期照护真正跑起来', label: '长期主义', effects: { ethics: 7, network: 5, stress: 2 } }, { text: '抓高风险患者，先把最关键的守住', label: '稳妥', effects: { skill: 5, legalRisk: -3, stress: 2 } }] },
    { id: 're_sp_dental_private_vs_public', stage: 'resident', title: '🎲 口腔在公立 vs 私立', text: '同样是做口腔，公立看学科体系，私立看服务和转化。你开始感到路线分叉。', returnTo: 'career_mobility_window', conditions: { specialty: 'dental', requireHospitalTier: ['regular_tier3', 'premium_private', 'international'] }, options: [{ text: '留在体系里，慢慢把技术和资历做深', label: '稳妥', effects: { skill: 7, stress: 2, ethics: 2 } }, { text: '认真研究服务与品牌逻辑，为以后转平台做准备', label: '长期主义', effects: { money: 5, network: 5, stress: 3 } }] },
    { id: 're_sp_obgyn_night_rush', stage: 'resident', title: '🎲 妇产夜间急救', text: '产房的呼叫不会问你困不困。很多决定，都是在凌晨做出的。', returnTo: 'night_shift_call', conditions: { specialty: 'obgyn' }, options: [{ text: '按流程稳住抢救和交接', label: '稳妥', effects: { skill: 7, legalRisk: -4, stress: 4 } }, { text: '主动多顶几次，把自己练成可靠的人', label: '激进', effects: { skill: 8, stress: 6, health: -3 } }] },
    { id: 're_sp_pathology_quality', stage: 'resident', title: '🎲 病理诊断质量责任', text: '你所在的平台也许不在台前，但一份报告上的一句话，能改变很多后续决策。', returnTo: 'complaint_case', conditions: { specialty: 'pathology_lab' }, options: [{ text: '每个边界性结论都反复核对', label: '稳妥', effects: { legalRisk: -5, skill: 6, stress: 3 } }, { text: '主动拉临床沟通，把报告背后的场景弄清楚', label: '团队协作', effects: { network: 6, skill: 4, stress: 2 } }] },

    { id: 're_headhunter_call', stage: 'resident', title: '🎲 猎头来电', text: '一个并不熟的号码直接打来，开口就是：“老师，您最近考虑职业流动吗？”', returnTo: 'career_mobility_window', conditions: { requireCareerTitle: ['resident', 'attending', 'associate_chief'] }, options: [{ text: '先听完，把外部市场当情报来源', label: '均衡', effects: { network: 6, stress: -2, money: 2 } }, { text: '直接拒绝，不让当前工作节奏被打断', label: '稳妥', effects: { ethics: 2, stress: -1 } }] },
    { id: 're_talent_introduction_offer', stage: 'senior', title: '🎲 人才引进邀请', text: '一座熟悉又陌生的城市发来邀请：岗位、补贴、住房、团队编制，都写得比很多公示更具体。', returnTo: 'senior_outcome', conditions: { requireCareerTitle: ['attending', 'associate_chief'] }, options: [{ text: '认真谈，看看是否值得重新布局人生', label: '长期主义', effects: { network: 8, money: 6, stress: 2 } }, { text: '暂时不动，把现平台的上升窗口再看一年', label: '稳妥', effects: { stress: -3, skill: 2 } }] },
    { id: 're_private_recruitment', stage: 'resident', title: '🎲 民营医院招募', text: '一个民营专科链把岗位说明书发给你，字里行间都在强调成长快、收入高、机制灵活。', returnTo: 'career_mobility_window', conditions: { forbidHospitalTier: ['premium_private', 'international'] }, options: [{ text: '把它当成谈判筹码，也当成真实备选', label: '均衡', effects: { network: 5, money: 3, stress: 1 } }, { text: '先不看，等自己资历再厚一点', label: '稳妥', effects: { skill: 3, stress: -2 } }] },
    { id: 're_county_chief_opportunity', stage: 'senior', title: '🎲 地方科主任机会', text: '地方医院缺的不是职位名字，而是真能把科室带起来的人。有人直接问你：愿不愿意回来试一把。', returnTo: 'career_mobility_county_chief', conditions: { requireHospitalTier: ['top_tier3', 'regular_tier3', 'prefecture_tier3_strong2'] }, options: [{ text: '认真评估，这是向上还是向外的一次跃迁', label: '长期主义', effects: { network: 6, ethics: 4, stress: 2 } }, { text: '先压住冲动，别被头衔两个字带跑', label: '稳妥', effects: { health: 3, stress: -3 } }] },
    { id: 're_international_dept_offer', stage: 'senior', title: '🎲 国际部邀请', text: '国际部门诊希望你兼任核心医生。平台更轻一些，要求却并不轻。', returnTo: 'career_mobility_private', conditions: { requireHospitalTier: ['premium_private', 'regular_tier3', 'top_tier3'] }, options: [{ text: '去谈合作模式，争取兼顾专业与生活', label: '均衡', effects: { money: 8, network: 6, stress: -2 } }, { text: '留在原体系，继续吃平台的确定性', label: '稳妥', effects: { skill: 4, ethics: 2 } }] },

    { id: 're_attending_promotion_prep', stage: 'senior', title: '🎲 主治升副高准备', text: '你已经不是最年轻的那拨人了，材料、年限、病例、论文，终于一起追上来。', returnTo: 'chief_competition', conditions: { requireCareerTitle: ['attending'] }, options: [{ text: '把每份材料都往经得起追问的方向做', label: '稳妥', effects: { skill: 5, ethics: 4, stress: 3 } }, { text: '找前辈模拟答辩，提前把短板暴露出来', label: '团队协作', effects: { network: 6, stress: 2, skill: 4 } }] },
    { id: 're_associate_chief_milestone', stage: 'senior', title: '🎲 副高里程碑', text: '胸牌上的字变化不大，但很多人看你的眼神变了：年轻医生开始等你一句话，科里也开始把更重的事压给你。', returnTo: 'senior_outcome', conditions: { requireCareerTitle: ['associate_chief'] }, options: [{ text: '把权力感变成带教和兜底能力', label: '长期主义', effects: { network: 7, ethics: 5, stress: 3 } }, { text: '顺势争取更大的平台与资源', label: '激进', effects: { network: 6, money: 5, stress: 5 } }] },
    { id: 're_dept_management_challenge', stage: 'senior', title: '🎲 科室管理挑战', text: '当你成了科室负责人，麻烦不再只来自病人，还来自排班、绩效、梯队、耗材、投诉和每个人的期待。', returnTo: 'senior_outcome', conditions: { requireCareerTitle: ['dept_head'] }, options: [{ text: '把制度建起来，别靠自己一个人燃烧', label: '团队协作', effects: { network: 8, stress: 4, ethics: 4 } }, { text: '亲自盯最关键的部分，先把底线守住', label: '稳妥', effects: { skill: 5, legalRisk: -4, stress: 5 } }] }
  ];

  randomEvents.push(...contextRandomEvents.map((event) => ({
    rarity: 'uncommon',
    weight: 5,
    ...event
  })));

  // ===== 扩展内容锚点（新增章节在此之前追加） =====
  // @@EXTENSION_ANCHOR@@

  // ===== 科室体验章节：每个科室 ≥5 个专属深度事件 =====
  const SPECIALTY_CHAPTER_THEMES = ['clinical', 'shift', 'communication', 'team', 'career'];

  function addChapterEvents(specialtyId, entries) {
    for (const entry of entries) {
      randomEvents.push({
        id: `re_sp_${specialtyId}_${entry.suffix}`,
        stage: 'resident',
        specialtyChapter: specialtyId,
        chapterTheme: entry.theme,
        title: entry.title,
        text: entry.text,
        rarity: 'uncommon',
        weight: entry.weight || 6,
        returnTo: entry.returnTo || 'ward_rounds',
        requireFlags: [specialtyFlag(specialtyId)],
        options: entry.options
      });
    }
  }

  addChapterEvents('pediatrics', [
    {
      suffix: 'ch_fever_triage', theme: 'clinical', title: '🩺 儿科：夜里第 47 个发热',
      text: '流感季的候诊区像春运。分诊台喊号的声音已经哑了，你面前这个孩子精神状态却和前面 46 个不太一样。',
      options: [
        { text: '停下节奏，把这一个从头到脚重新查一遍', label: '稳妥', effects: { skill: 3, ethics: 3, legalRisk: -3, stress: 3 }, resultText: '你把听诊器移到了别人不会多停的位置，发现了一处不该有的杂音。后面排队的家长开始不耐烦，但这个孩子当晚就收进了病房。护士站小声说了句“幸好”，你把这两个字记了很久。' },
        { text: '按流程快速处理，先把候诊队列压下去', label: '均衡', effects: { skill: 2, stress: 4, health: -2 }, resultText: '你用九十分钟消化了三十个号，效率写进了当月简报。简报没写的是，你下班后在更衣室反复回想有没有漏掉谁——这个环节从来不在任何考核指标里。' },
        { text: '把可疑的几个全部留观，宁可被投诉也不放走', label: '激进', effects: { ethics: 4, legalRisk: -4, stress: 6, health: -3 }, resultText: '留观室瞬间坐满，家长的脸色和床位数一起紧张起来。第二天有两个孩子确实转了重，也有五个家长投诉“小题大做”。你同时收获了一封表扬信和一封投诉信，它们在同一个文件夹里躺着。' }
      ]
    },
    {
      suffix: 'ch_night_flu_peak', theme: 'shift', title: '🌙 儿科：高峰季的排班表',
      text: '排班表在科室群里发出来，@全体成员，附言只有四个字：“克服一下。”',
      options: [
        { text: '主动认领最难的两个班，换后面的调休承诺', label: '激进', effects: { skill: 3, network: 3, stress: 7, health: -5 }, resultText: '你成了排班表上最好用的那个名字。调休承诺被记在主任的备忘录里，而备忘录后来跟着主任一起去开了会。你多了两句“辛苦了”，少了两个周末。' },
        { text: '如实说明身体状况，请科里重新平衡', label: '稳妥', effects: { health: 4, stress: -5, network: -2 }, resultText: '你在群里发了一段措辞谨慎的话，隔了十一分钟才有人回“收到”。班调整了，你也第一次体会到“会哭的孩子有奶吃”后面那半句：哭完还得自己擦脸。' },
        { text: '和同期私下互换，把班拼成能活的形状', label: '团队协作', effects: { network: 5, stress: -3, health: 2 }, resultText: '你们几个人在一个只有五个人的小群里，用三十条消息完成了整个科室的排班优化。这份成果不会出现在任何管理经验总结里，但它确实让四个人多睡了几晚。' }
      ]
    },
    {
      suffix: 'ch_parent_conflict', theme: 'communication', title: '💬 儿科：家长带着搜索结果来了',
      text: '一位家长把手机屏幕举到你面前，上面是一篇十万加：《这些症状，医生都不会告诉你》。',
      options: [
        { text: '逐条对着病情解释，把误解拆开', label: '长期主义', effects: { ethics: 5, network: 3, stress: 4, health: -2 }, resultText: '你花了二十二分钟，把那篇文章从标题拆到结尾。家长最后说“那我信你”，你却在想：这二十二分钟，在门诊量统计里等于零点五个号。' },
        { text: '请护士长一起沟通，把场面稳住', label: '团队协作', effects: { network: 5, legalRisk: -3, stress: -2 }, resultText: '护士长出场十秒就把气氛压了下来——她比你多的不是知识，是把话说到人心里的年头。你在旁边默默学会了一招，这招后来救过你好几次。' },
        { text: '简短说明后请对方按流程投诉', label: '均衡', effects: { stress: -4, ethics: -3, legalRisk: 4 }, resultText: '你把话说得滴水不漏，也把人推得干干净净。投诉件三周后转到科里，写着“态度冷淡”。你在回复栏里写了八百字，比当时多说两句要费劲得多。' }
      ]
    },
    {
      suffix: 'ch_team_handover', theme: 'team', title: '🤝 儿科：一次交接班的裂缝',
      text: '上一班留下的记录里，有一句“家属已知情”，但没写知情了什么。',
      options: [
        { text: '当面问清楚再签字，哪怕多耗二十分钟', label: '稳妥', effects: { legalRisk: -5, skill: 2, stress: 3 }, resultText: '你把上一班的人从电梯口叫了回来。她愣了两秒，然后说“谢谢你叫住我”。那句含糊的记录被补成了三行字，三行字后来在一次纠纷里成了最关键的三行。' },
        { text: '推动科里改交接模板，把模糊表述堵死', label: '团队协作', effects: { network: 5, legalRisk: -4, stress: 3 }, resultText: '新模板上线第一周，全科都在骂它太啰嗦；第三周，有人靠它躲过了一次追责。质量管理的意义大概就是：被讨厌，然后被需要。' },
        { text: '照签不误，反正大家都这么写', label: '激进', effects: { stress: -3, legalRisk: 6, ethics: -3 }, flagsSet: ['record_shortcut'], resultText: '你签了字，笔尖顿了一下。那一顿是你自己知道的部分，病历上看不出来——直到很久以后，有人一页页翻它的时候，才会看出来。' }
      ]
    },
    {
      suffix: 'ch_career_shortage', theme: 'career', title: '📈 儿科：紧缺岗位的诱惑与账单',
      text: '院里放出儿科紧缺岗位补贴，同时新增“专病门诊建设”任务。补贴是真的，任务也是真的。',
      options: [
        { text: '接下专病门诊，把儿科做出自己的招牌', label: '长期主义', effects: { skill: 4, network: 4, money: 4, stress: 6, health: -3 }, resultText: '你的名字第一次单独出现在门诊排班表上。同时出现的还有一个 Excel，要求每月报三十七项数据。你终于理解了什么叫“既要专业深度，又要数据颗粒度，还要患者满意度”。' },
        { text: '拿补贴但不接额外任务，先保住生活', label: '稳妥', effects: { money: 3, health: 3, stress: -4, network: -2 }, resultText: '你成了科里那个“可以，但不多”的人。年终评优没有你，年终体检报告倒是很给面子。你把两张纸并排放着看了一会儿，选择先睡个好觉。' },
        { text: '把机会让给更需要的同事，换一份人情', label: '团队协作', effects: { network: 6, ethics: 4, money: -2 }, resultText: '你让出去的那个名额，后来变成了同事的第一篇核心期刊。他请你吃了顿饭，说“这份人情我记着”。在医院里，记着的人情有时候比补贴保值。' }
      ]
    }
  ]);

  addChapterEvents('emergency_critical', [
    {
      suffix: 'ch_mass_casualty', theme: 'clinical', title: '🚑 急诊：同时来了三个红色预警',
      text: '一辆车、一场施工事故、一个自己走进来却马上倒下的人，在四分钟内挤进同一个抢救室。',
      options: [
        { text: '按分级抢救，冷静排优先级', label: '稳妥', effects: { skill: 4, legalRisk: -4, stress: 6, health: -3 }, resultText: '你在白板上写下三个名字和三个数字，手很稳，字很丑。事后复盘会说你的分级"教科书级别"，你只记得当时脑子里反复循环的是一句：别抖，别抖，别抖。' },
        { text: '自己顶最重的那个，其余交给同事', label: '激进', effects: { skill: 5, stress: 8, health: -5 }, resultText: '你守住了最重的那个，代价是接下来七十二小时里，你的胃只见过速溶咖啡。同事说你像开了挂，只有你知道那不是挂，是透支。' },
        { text: '立刻呼叫院内应急，把资源拉进来', label: '团队协作', effects: { network: 6, legalRisk: -3, stress: 2 }, resultText: '你一个电话叫醒了半个医院。有人在群里问"有必要吗"，两小时后没人再问了。你学会了一件事：在急诊，宁可被问一次"有必要吗"，也不要被问"当时为什么不叫人"。' }
      ]
    },
    {
      suffix: 'ch_shift_cycle', theme: 'shift', title: '🌙 急诊：连轴转第三个夜班',
      text: '你已经分不清今天是周几，只知道再过两个小时天会亮，而天亮不代表你能走。',
      options: [
        { text: '交班后强制自己回家睡满八小时', label: '休息', effects: { health: 6, stress: -8, skill: -1 }, resultText: '你把手机调成飞行模式，醒来时有十九条未读。世界没有塌，只是你的名字在几个群里被 @ 了几次。你第一次发现，"必不可少"这个感觉大部分是自我暗示。' },
        { text: '硬撑着把交班记录和病历补完再走', label: '激进', effects: { legalRisk: -3, skill: 2, health: -6, stress: 5 }, resultText: '病历补完了，你在更衣室坐了十分钟才想起来站不站得起来。质控数据很好看，好看到你怀疑它们是用睡眠换的——因为确实是。' },
        { text: '和同事约定互相盯睡眠，超时就赶人走', label: '团队协作', effects: { network: 5, health: 4, stress: -5 }, resultText: '你们在值班室贴了一张纸：谁超过三十小时没睡，另一个人有权把他赶出去。这张纸后来被主任看见了，他没撕，还在下面签了个名。' }
      ]
    },
    {
      suffix: 'ch_family_rage', theme: 'communication', title: '💬 急诊：走廊里的怒吼',
      text: '一位家属的情绪在等待的第四十分钟彻底爆开，声音大到抢救室里都听得见。',
      options: [
        { text: '走出去，先接住情绪再讲事实', label: '长期主义', effects: { ethics: 5, network: 3, stress: 5, health: -2 }, resultText: '你说的第一句不是"请您冷静"，而是"我知道您等了很久"。对方的音量降了一半。你后来才明白，急诊沟通里最难的技术不是解释病情，是让人相信你没有在敷衍。' },
        { text: '按流程叫保卫科，先保证抢救不被打断', label: '稳妥', effects: { legalRisk: -5, stress: 2, ethics: -2 }, resultText: '秩序恢复得很快，代价是那位家属从此认定"医院和保安是一伙的"。你保住了抢救室，也失去了一个本来可以说通的人。这道题没有满分答案。' },
        { text: '让年轻医生去顶，自己继续抢救', label: '均衡', effects: { skill: 3, network: -3, stress: 3 }, resultText: '你选了抢救。年轻医生在走廊里被骂了十五分钟，回来时眼睛红着说"没事"。你说了句"辛苦了"，然后发现这三个字在急诊科的通货膨胀率高得惊人。' }
      ]
    },
    {
      suffix: 'ch_bed_negotiation', theme: 'team', title: '🤝 急诊：床位是一门外交学',
      text: '病人需要收住院，专科说没床，ICU 说不够重，你说再等就来不及。',
      options: [
        { text: '一个个科室打电话磨，直到有人松口', label: '激进', effects: { network: 4, stress: 7, skill: 2 }, resultText: '你打了七个电话，被拒绝六次，第七次对方说"看在你打了这么多个的份上"。这句话让你意识到，急诊留观区的床位分配学，本质上是一门关于脸皮厚度的学科。' },
        { text: '拉医务处协调，让规则替你说话', label: '团队协作', effects: { network: 6, legalRisk: -3, stress: 1 }, resultText: '医务处一个电话，床位十分钟到位。你有点复杂：明明是同样的病人、同样的病情，只是说话的人换了个工号。' },
        { text: '就地升级监护，在急诊自己扛', label: '稳妥', effects: { skill: 4, legalRisk: -2, health: -4, stress: 5 }, resultText: '你把抢救室当成了临时 ICU，也把自己当成了临时全能。病人稳住了，你的腰在第六小时开始抗议。急诊的一切都是临时的，除了这份腰痛。' }
      ]
    },
    {
      suffix: 'ch_career_burnrate', theme: 'career', title: '📈 急诊：三十五岁的续航评估',
      text: '有人问你：急诊这条路，你打算跑到几岁？这个问题比任何一次抢救都难回答。',
      options: [
        { text: '继续深耕重症，做最硬的那块骨头', label: '激进', effects: { skill: 5, network: 3, stress: 7, health: -5 }, resultText: '你选择了继续跑。三年后你成了科里最能扛的人，也成了体检报告最丰富的人。硬骨头这个称呼，一半是敬意，一半是提醒。' },
        { text: '转向院前急救/急诊管理，换个位置继续', label: '均衡', effects: { network: 5, health: 4, stress: -4, skill: -1 }, resultText: '你从抢救室走到了调度台。同事说"你解脱了"，你说"只是换了个地方被叫醒"。但至少，现在被叫醒时你穿着睡衣，而不是隔离衣。' },
        { text: '认真评估转到节奏可控的方向', label: '长期主义', effects: { health: 6, stress: -6, network: -3, money: -2 }, flagsSet: ['consider_switching_specialty'], resultText: '你把这个念头写进了备忘录，标题叫"关于活到六十岁的可行性研究"。写完之后你反而睡了一个好觉——原来光是承认自己撑不住，就已经卸掉一半重量。' }
      ]
    }
  ]);

  addChapterEvents('internal', [
    {
      suffix: 'ch_diagnostic_maze', theme: 'clinical', title: '🩺 内科：查了两周还是查不明白',
      text: '所有能做的检查都做了，所有能想的鉴别都想了，患者的发热还在，家属的耐心在减少。',
      options: [
        { text: '重新问一遍病史，从头开始', label: '稳妥', effects: { skill: 4, ethics: 3, stress: 3 }, resultText: '你搬了张凳子坐下来，问到第四十分钟，患者忽然说"哦对了，我上个月去过一趟山里"。这句话推翻了两周的思路。内科的真相经常藏在没人问过的那一句里。' },
        { text: '发起多学科会诊，把问题摊开', label: '团队协作', effects: { network: 6, skill: 3, stress: 2 }, resultText: '会诊室坐了七个科室，讨论了五十分钟，结论是"建议随访观察"。但会后感染科的老师私下给你指了一条路——真正有用的信息，往往在会议纪要之外。' },
        { text: '按经验先上治疗，边治边看', label: '激进', effects: { skill: 3, legalRisk: 4, stress: 4 }, resultText: '你赌了一把，赌对了。患者第三天退烧，你在病程记录里写得非常谨慎。有些正确的决定，事后是不敢写得太理直气壮的。' }
      ]
    },
    {
      suffix: 'ch_chronic_followup', theme: 'shift', title: '🌙 内科：门诊、病房、值班的三体问题',
      text: '同一周里你要出四个半天门诊、管十六张床、值两个夜班，还要交一份教学材料。',
      options: [
        { text: '把病房交给下级，自己守住门诊质量', label: '均衡', effects: { skill: 3, network: 2, stress: 3 }, resultText: '你学会了授权，也学会了在别人做得没你好的时候闭嘴。这是内科医生成长里最难的一课：接受"够用"，而不是追求"最好"。' },
        { text: '全部自己抓，一个环节都不放手', label: '激进', effects: { skill: 4, legalRisk: -3, health: -6, stress: 8 }, resultText: '这一周你处理得滴水不漏，也在周五下午的门诊上第一次叫错了病人的名字。事无巨细的另一面，是人的带宽终究是有限的。' },
        { text: '主动和主任谈工作量，请求重排', label: '稳妥', effects: { network: 3, stress: -5, health: 3 }, resultText: '主任听完点点头，说"你说得对"，然后把你的门诊减了半天，教学材料的截止日期提前了三天。你意识到，沟通有时候只是把压力换个形状。' }
      ]
    },
    {
      suffix: 'ch_bad_news', theme: 'communication', title: '💬 内科：如何说出那个诊断',
      text: '病理结果出来了。家属在门外，患者在门内，两边都想先知道，两边想知道的答案不一样。',
      options: [
        { text: '先和家属沟通节奏，再一起告诉患者', label: '长期主义', effects: { ethics: 5, network: 3, stress: 4 }, resultText: '你花了四十分钟做"告知的预告"。患者听完之后说了句"我早就猜到了，谢谢你没骗我"。你在走廊里站了一会儿——这份工作最重的部分，从来不在病历里。' },
        { text: '按知情同意原则直接告知患者本人', label: '稳妥', effects: { ethics: 4, legalRisk: -4, stress: 5, network: -2 }, resultText: '你守住了原则，家属在门外骂了你二十分钟。你把两件事都记在心里：法律站在你这边，但你还是希望当时能有更好的方式。' },
        { text: '含糊带过，把难题留给上级', label: '均衡', effects: { stress: -4, ethics: -4, network: -2 }, resultText: '你说了三句非常专业的话，专业到没有传递任何信息。上级第二天替你补上了这场谈话，回来只说了句："下次你来。"这四个字比批评更重。' }
      ]
    },
    {
      suffix: 'ch_ward_teaching', theme: 'team', title: '🤝 内科：带教查房的公开处刑',
      text: '主任查房时点了实习生的名，实习生答不上来，全组沉默。主任转头看向你。',
      options: [
        { text: '替实习生兜住，然后课后单独复盘', label: '团队协作', effects: { network: 5, ethics: 4, skill: 2, stress: 2 }, resultText: '你接住了那个问题，也接住了一个年轻人的自尊。三年后他成了别人的带教，第一节课讲的就是"不要在床边让学生难堪"。' },
        { text: '如实说明学生的知识盲区，公事公办', label: '稳妥', effects: { skill: 3, ethics: 2, network: -3 }, resultText: '你说的每个字都对，气氛冷得像影像科的机房。实习生后来学得更认真了，也再没主动问过你问题。正确和有效之间，隔着一整条走廊。' },
        { text: '顺势把问题拉高，转成全组讨论', label: '长期主义', effects: { skill: 4, network: 4, stress: 2 }, resultText: '你把"你不会"变成了"我们一起想"，主任眉毛动了一下。这一招后来成了你的招牌，只是没人知道你是那天在走廊上被逼出来的。' }
      ]
    },
    {
      suffix: 'ch_subspecialty_pick', theme: 'career', title: '📈 内科：亚专科的分岔口',
      text: '内科太大了，大到你必须选一小块地深挖。心内、消化、呼吸、内分泌、血液——每一块都有人已经站在那里。',
      options: [
        { text: '选竞争激烈但资源集中的热门亚专科', label: '激进', effects: { skill: 4, research: 4, network: 3, stress: 7, health: -3 }, resultText: '你挤进了科里最挤的那条赛道。好处是资源多、机会多、论文多；坏处是排在你前面的人也多，而他们比你早站了十年。' },
        { text: '选相对冷门但你真正感兴趣的方向', label: '长期主义', effects: { skill: 4, research: 3, ethics: 3, money: -2, stress: 3 }, resultText: '你选了一个连科室介绍页都写在最后一行的方向。五年后这个方向因为一个新药火了，你成了科里唯一有积累的人。运气眷顾长期主义，但它迟到了五年。' },
        { text: '暂不站队，先把通科能力做扎实', label: '稳妥', effects: { skill: 4, health: 3, stress: -3, research: -2 }, resultText: '你成了那个"什么都会一点"的人。评职称时这不是优势，值班时这是全科室的保险。两种价值，只有一种能写进材料。' }
      ]
    }
  ]);

  addChapterEvents('surgery', [
    {
      suffix: 'ch_first_solo', theme: 'clinical', title: '🔪 外科：第一次真正主刀',
      text: '上级站在你身后半步，那半步的距离意味着：这台手术是你的了。',
      options: [
        { text: '严格按步骤走，慢一点也不冒进', label: '稳妥', effects: { skill: 4, legalRisk: -4, stress: 6, health: -2 }, resultText: '你比标准时间多用了四十分钟，上级一句话没说。下台后他递给你一瓶水："快是练出来的，稳是选出来的。"这句话你记了很多年。' },
        { text: '遇到解剖变异时坚持自己判断处理', label: '激进', effects: { skill: 6, legalRisk: 4, stress: 8, health: -4 }, resultText: '你处理对了，但过程中有十几秒钟你的手心全是汗。术后上级说"可以"，语气里有欣赏也有后怕。外科的成长曲线，就是由这样一些十几秒钟串起来的。' },
        { text: '主动请上级接手关键步骤', label: '团队协作', effects: { network: 4, skill: 2, legalRisk: -4, stress: -2 }, resultText: '你说了"老师您来"，上级接过器械时点了点头。有人觉得这是示弱，但手术室里最贵的东西是病人的安全，不是你的面子。' }
      ]
    },
    {
      suffix: 'ch_or_schedule', theme: 'shift', title: '🌙 外科：连台手术排到晚上十点',
      text: '手术通知单上还有三台，麻醉科在问能不能接，护士在问饭点怎么算，你在问自己还能不能站。',
      options: [
        { text: '全部接下来，把手术量做上去', label: '激进', effects: { skill: 4, money: 3, stress: 8, health: -6 }, resultText: '你在第三台的缝合阶段发现手指在抖，于是把最后一层交给了一助。当晚的手术量数据很漂亮，你的膝盖不太同意这个说法。' },
        { text: '主动推掉一台，改到次日择期', label: '稳妥', effects: { health: 4, legalRisk: -3, stress: -4, money: -2 }, resultText: '你在群里发了推台通知，收到两个"好的"和一个句号。那个句号让你不太舒服，但第二天你的手很稳——这笔账算下来还是赚的。' },
        { text: '和麻醉、护理一起重排顺序，把风险最高的提前', label: '团队协作', effects: { network: 5, skill: 3, legalRisk: -3, stress: 2 }, resultText: '三个科室在手术室门口开了个五分钟的站立会议，效率高得不像医院。你第一次感受到，手术室其实是全院最像一个团队的地方。' }
      ]
    },
    {
      suffix: 'ch_complication_talk', theme: 'communication', title: '💬 外科：术后并发症的那场谈话',
      text: '手术很成功，但患者出现了发生率写在同意书第三页的那个并发症。家属拿着同意书站在办公室门口。',
      options: [
        { text: '坦诚说明经过与后续方案，不推卸', label: '长期主义', effects: { ethics: 6, legalRisk: -5, network: 3, stress: 5 }, resultText: '你把术中每一步都讲了一遍，包括你当时的犹豫。家属沉默了很久，最后说"我们再想想"。三天后他们签了二次手术同意书，并且指定还是你做。' },
        { text: '强调风险已提前告知，走正式流程', label: '稳妥', effects: { legalRisk: -4, stress: 2, ethics: -3 }, resultText: '你的表述无懈可击，法律风险归零，家属的信任也归零。你在办公室里对着那份签好的同意书看了很久，它保护了你，但没保护住那段关系。' },
        { text: '请科主任和医务处一起面对', label: '团队协作', effects: { network: 5, legalRisk: -5, stress: -2, ethics: 2 }, resultText: '主任说的话和你想说的其实一样，但从他嘴里出来就多了三十年的分量。你在旁边记笔记，记的不是内容，是节奏。' }
      ]
    },
    {
      suffix: 'ch_or_hierarchy', theme: 'team', title: '🤝 外科：谁上台，是一门政治学',
      text: '一台罕见术式排下来，科里三个人都想上。名单还没定，微信已经开始转圈。',
      options: [
        { text: '摆出自己的病例积累，正面争取', label: '激进', effects: { network: 3, skill: 4, stress: 6 }, resultText: '你把这三年的病例做成了一页 PPT，主任看了两眼说"你上"。争取有用，但前提是你手里真有东西——PPT 做得再好看，也变不出病例数。' },
        { text: '主动做一助，把技术学到手再说', label: '长期主义', effects: { skill: 5, network: 4, stress: 3, health: -2 }, resultText: '你站在了第二位置，看清了每一个细节。三个月后同样的术式又来了一台，主任直接点了你的名。有些位置是争来的，有些是等来的。' },
        { text: '找主任私下沟通长期分工', label: '团队协作', effects: { network: 6, stress: -2, skill: 2 }, resultText: '你们聊了二十分钟，从术式聊到了亚专科规划。你走出办公室时明白了一件事：外科的技术天花板在手上，职业天花板在这样的二十分钟里。' }
      ]
    },
    {
      suffix: 'ch_career_volume', theme: 'career', title: '📈 外科：手术量、腰椎和家庭时间',
      text: '你的手术量在科里排第二，腰椎 MRI 也在科里排第二。家里的合影里，最近三张都没有你。',
      options: [
        { text: '继续冲量，趁能开的时候多开', label: '激进', effects: { skill: 5, money: 4, stress: 7, health: -6 }, resultText: '你的年手术量创了新高，也第一次开始戴护腰上台。同事说你像台机器，你说机器还有保养周期，我没有。' },
        { text: '控制台次，把精力放在难度而非数量', label: '均衡', effects: { skill: 4, health: 3, stress: -3, money: -2 }, resultText: '你开始挑病例，也开始被说"不接活"。但一年后你的复杂手术占比全科第一，而那个说你不接活的人腰椎间盘突出了。' },
        { text: '申请调整排班，把周末真正还给家庭', label: '稳妥', effects: { health: 5, stress: -6, network: -2, money: -2 }, resultText: '你在家庭合影里重新出现了。代价是科室群里那句"某某最近状态不错，就是有点佛"。你决定把"佛"当成一句表扬来收。' }
      ]
    }
  ]);

  addChapterEvents('obgyn', [
    {
      suffix: 'ch_delivery_crisis', theme: 'clinical', title: '🩺 妇产：产房里最长的三分钟',
      text: '胎心突然掉下来。所有人的动作在同一秒变快，只有时间变慢了。',
      options: [
        { text: '立即启动紧急剖宫产流程', label: '稳妥', effects: { skill: 5, legalRisk: -5, stress: 8, health: -4 }, resultText: '从决定到取出，用了十一分钟。你在写记录时才发现自己一直屏着呼吸。产房的时间单位不是分钟，是"来不来得及"。' },
        { text: '再观察片刻，尝试保住顺产', label: '激进', effects: { skill: 4, legalRisk: 6, stress: 9, health: -4 }, resultText: '胎心回来了，你也回来了。但那两分钟的判断，你后来在心里重放了不下二十次——产科没有"如果当时"，只有"幸好"和"要是"。' },
        { text: '呼叫上级和新生儿科同时到位', label: '团队协作', effects: { network: 5, legalRisk: -4, skill: 3, stress: 4 }, resultText: '三个科室在四分钟内挤满了产房，场面像调度失控，其实每个人都知道自己站在哪。事后你想：这大概就是所谓的"体系"，平时看不见，关键时刻托得住。' }
      ]
    },
    {
      suffix: 'ch_night_delivery', theme: 'shift', title: '🌙 妇产：孩子不看排班表',
      text: '凌晨两点四十，第三个产妇进产房。你的值班记录已经写到第五页。',
      options: [
        { text: '坚持全程自己盯，不交给下级', label: '激进', effects: { skill: 4, legalRisk: -3, health: -6, stress: 7 }, resultText: '天亮时你接生了四个孩子，收获了四声啼哭和一次视野发黑。产科的成就感来得非常直接，代价也是。' },
        { text: '按分工放手，自己守住高危那一个', label: '均衡', effects: { skill: 3, network: 3, stress: 2, health: -2 }, resultText: '你把两个低危交给了住院医，自己盯着那个疤痕子宫。事实证明分配是对的——凌晨的判断力是有限资源，得花在刀刃上。' },
        { text: '交班时主动申请下一周减夜班', label: '稳妥', effects: { health: 5, stress: -6, network: -2 }, resultText: '护士长看了你一眼说"早该说了"。你才发现，科室里没人觉得你必须硬撑，只有你自己这么觉得。' }
      ]
    },
    {
      suffix: 'ch_decision_conflict', theme: 'communication', title: '💬 妇产：谁来签这个字',
      text: '产妇本人的意愿、丈夫的意见和婆婆的坚持，在同一张知情同意书前正面相撞。',
      options: [
        { text: '明确以产妇本人意愿为准，并做好记录', label: '长期主义', effects: { ethics: 7, legalRisk: -5, stress: 5, network: -2 }, resultText: '你把办公室的门关上，只留下产妇一个人问她想怎么做。她哭了，然后签了字。走廊上的争吵还在继续，但那扇门里的决定是干净的。' },
        { text: '组织家庭会议，把分歧摆到台面上', label: '团队协作', effects: { network: 5, ethics: 4, stress: 4 }, resultText: '你主持了一场四十分钟的家庭会议，比很多科室会议更有成效。散会时婆婆说了句"医生你辛苦了"——这句话来得比你预想的晚，但确实来了。' },
        { text: '按常规请家属代签，先推进流程', label: '均衡', effects: { stress: -3, ethics: -5, legalRisk: 6 }, resultText: '流程走完了，你却在整理病历时停了一下。这个字签得合规，但不太合心。有些操作在制度上没问题，在夜里想起来会有点问题。' }
      ]
    },
    {
      suffix: 'ch_team_midwife', theme: 'team', title: '🤝 妇产：助产士说她有个感觉',
      text: '资深助产士拉住你："这个产妇我看着不对劲，说不上来哪里。"监护数据是正常的。',
      options: [
        { text: '相信经验，加强监护并提前准备', label: '稳妥', effects: { skill: 4, legalRisk: -5, network: 4, stress: 3 }, resultText: '两小时后情况确实变了，因为准备做在前面，一切都在掌控内。你后来常跟年轻医生说：数据是证据，但老助产士的"说不上来"也是。' },
        { text: '按数据判断，暂不改变方案', label: '均衡', effects: { skill: 2, legalRisk: 3, network: -3, stress: 4 }, resultText: '这次没出事，但助产士后来再没跟你说过"我有个感觉"。你损失的不是一次判断，是一条预警线路。' },
        { text: '请上级一起评估，把分歧变成讨论', label: '团队协作', effects: { network: 6, skill: 3, legalRisk: -3, stress: 1 }, resultText: '上级听完两边说了句"那就都做上"。这种既不否定数据也不否定直觉的处理方式，你后来抄了很多次。' }
      ]
    },
    {
      suffix: 'ch_career_reputation', theme: 'career', title: '📈 妇产：口碑是怎么长出来的',
      text: '一位产妇在网上写了长文感谢你，随后门诊量涨了三成，投诉风险也涨了三成。',
      options: [
        { text: '顺势建立自己的专病门诊和随访体系', label: '长期主义', effects: { network: 5, skill: 4, money: 4, stress: 6, health: -3 }, resultText: '你的号变得很难挂，你的时间变得更难约。随访体系建起来那天，你在系统里看到自己名下有四百多个待随访——成就感和窒息感同时到达。' },
        { text: '低调处理，避免被流量绑架', label: '稳妥', effects: { health: 3, stress: -4, ethics: 3, network: -2 }, resultText: '你婉拒了宣传科的采访请求。科里有人不理解，你说流量来得快去得也快，但医疗事故的记录是永久的。' },
        { text: '接受院方宣传安排，把个人品牌做起来', label: '激进', effects: { network: 6, money: 4, stress: 5, ethics: -2 }, resultText: '你上了医院公众号头条，配图是一张你自己都没见过的摆拍照片。评论区很热闹，热闹到有人开始问"这个医生是不是收红包"。' }
      ]
    }
  ]);

  addChapterEvents('anesthesia', [
    {
      suffix: 'ch_airway_crisis', theme: 'clinical', title: '🩺 麻醉：预料之外的困难气道',
      text: '评估时一切正常，诱导后你发现根本插不进去。血氧开始往下走。',
      options: [
        { text: '按困难气道流程逐级升级处理', label: '稳妥', effects: { skill: 5, legalRisk: -5, stress: 8, health: -3 }, resultText: '你在四十秒内换了三种方案，第三种成功了。术后你把这台写成了科室案例，标题很朴素："流程为什么必须背下来"。' },
        { text: '立刻叫人，同时保持面罩通气', label: '团队协作', effects: { network: 5, legalRisk: -4, skill: 3, stress: 5 }, resultText: '上级冲进来时你已经把氧合维持住了。他说的第一句是"叫得好"。麻醉科的英雄主义，往往表现为及时承认自己需要帮手。' },
        { text: '再试一次，相信自己的手感', label: '激进', effects: { skill: 4, legalRisk: 6, stress: 9, health: -4 }, resultText: '你成功了，血氧最低掉到八十六。手术顺利结束，但你在麻醉记录上写下那个数字时，笔迹比平时用力。' }
      ]
    },
    {
      suffix: 'ch_or_marathon', theme: 'shift', title: '🌙 麻醉：一个人管三间手术室',
      text: '今天走了两个人，剩下的台次没有减少。调度问你能不能"兼顾一下"。',
      options: [
        { text: '明确拒绝超范围兼顾，要求增派人手', label: '稳妥', effects: { legalRisk: -5, ethics: 4, stress: 3, network: -3 }, resultText: '你在群里写下"麻醉不能一人多间，这是底线"，然后等了十九分钟。人手来了，你也上了某位领导的心理小名单。有些底线守住的代价就是这样。' },
        { text: '答应兼顾，但只接风险最低的台', label: '均衡', effects: { skill: 2, stress: 6, health: -4, legalRisk: 2 }, resultText: '你在三个房间之间来回走了六个小时，走出了微信步数第一名。晚上你想：如果哪天出事，这一天的步数会不会被当成证据？' },
        { text: '全部接下来，先保住手术不停摆', label: '激进', effects: { network: 4, money: 3, stress: 9, health: -7, legalRisk: 5 }, resultText: '所有台次都做完了，医院的运营数据保住了。你回家后倒在沙发上，忽然觉得"保住"这个词用在自己身上有点奢侈。' }
      ]
    },
    {
      suffix: 'ch_invisible_talk', theme: 'communication', title: '💬 麻醉：患者说"你只是打个针的吧"',
      text: '术前访视时，患者摆摆手："麻醉嘛，我知道，睡一觉就好了。"',
      options: [
        { text: '认真解释麻醉风险与围术期管理', label: '长期主义', effects: { ethics: 5, legalRisk: -4, skill: 2, stress: 3 }, resultText: '你讲了七分钟，患者的表情从敷衍变成了认真。他最后说"原来这么复杂"。麻醉科最大的职业困境就是：做得越好，越像没做什么。' },
        { text: '简要说明重点，把时间留给更多访视', label: '均衡', effects: { skill: 2, stress: -2, legalRisk: 2 }, resultText: '你用两分钟走完了流程，效率很高。当天你访视了二十三个患者，其中十九个到最后也不知道麻醉医生是干什么的。' },
        { text: '递上科室做的科普卡片，顺便刷存在感', label: '团队协作', effects: { network: 4, ethics: 3, stress: -1 }, resultText: '那张卡片是科里几个人熬夜做的，印刷费自掏腰包。患者收下了，还拍照发了朋友圈。这大概是麻醉科最划算的一次品牌投资。' }
      ]
    },
    {
      suffix: 'ch_surgeon_pressure', theme: 'team', title: '🤝 麻醉：外科医生说"再等等，快好了"',
      text: '手术已经超时，患者生命体征在往不好的方向漂。你说该停了，术者说还差最后一步。',
      options: [
        { text: '坚持叫停，把安全放在台次前面', label: '稳妥', effects: { ethics: 6, legalRisk: -5, skill: 3, stress: 6, network: -3 }, resultText: '你按住了那句"停"。手术分两期做完，患者平安。术者三天没跟你说话，一个月后他在电梯里说了句"那次是你对"。' },
        { text: '边支持边设最后期限，给术者十分钟', label: '均衡', effects: { skill: 4, network: 3, legalRisk: -2, stress: 5 }, resultText: '你给了十分钟，也做好了随时叫停的准备。手术在第九分钟结束。麻醉医生的谈判技巧，本质上是给别人台阶，同时把手放在刹车上。' },
        { text: '继续硬撑，避免和外科正面冲突', label: '激进', effects: { network: 2, legalRisk: 7, health: -3, stress: 8, ethics: -4 }, resultText: '手术做完了，患者当晚进了 ICU。没有人明确追究，但你自己知道那句没说出口的话去了哪里——它留在你心里，比留在病历上更沉。' }
      ]
    },
    {
      suffix: 'ch_career_pain_clinic', theme: 'career', title: '📈 麻醉：疼痛门诊还是继续台上',
      text: '科里要开疼痛门诊，需要一个人牵头。这意味着白天坐诊，但也意味着离开手术室的主战场。',
      options: [
        { text: '接下疼痛门诊，开辟自己的方向', label: '长期主义', effects: { skill: 4, network: 4, money: 3, stress: 5 }, resultText: '你从幕后走到了台前，第一次有患者记住了你的名字并且指名要挂你的号。麻醉医生被看见的方式不多，这是其中一种。' },
        { text: '留在手术室，把围术期管理做到极致', label: '稳妥', effects: { skill: 5, legalRisk: -3, stress: 3, health: -2 }, resultText: '你选择了继续做那个不被看见的人。三年后科里出了并发症最少的记录，数据表格上没有你的名字，但每个人都知道那几年是谁在盯。' },
        { text: '两边都做，赌一次全面开花', label: '激进', effects: { skill: 4, network: 4, money: 4, stress: 8, health: -5 }, resultText: '你的日程表变成了俄罗斯方块，而且是加速版。半年后你在门诊上打了个盹，被自己的鼾声惊醒。全面开花的前提，是人不是花。' }
      ]
    }
  ]);

  addChapterEvents('dental', [
    {
      suffix: 'ch_root_canal_fail', theme: 'clinical', title: '🦷 口腔：那颗牙的根管有四个',
      text: '术前片子上是三个根管，操作到一半你发现还有第四个，而且弯得像迷宫。',
      options: [
        { text: '停下来重新拍片，宁可加时也要看清', label: '稳妥', effects: { skill: 4, legalRisk: -4, stress: 3, money: -2 }, resultText: '你加了一次影像，多花了四十分钟。患者抱怨时间太久，三年后那颗牙还好好的。口腔科的时间账，要按年结算才看得懂。' },
        { text: '凭手感继续处理，先把这次做完', label: '激进', effects: { skill: 3, legalRisk: 5, stress: 5 }, resultText: '你处理完了，感觉还行。八个月后患者带着疼痛回来，你在片子上看到了那个被遗漏的角落。有些捷径的账单是延期送达的。' },
        { text: '请上级会诊，把病例转成教学案例', label: '团队协作', effects: { network: 5, skill: 4, stress: 1 }, resultText: '上级来了，一边操作一边讲，围了三个规培生。这台治疗最后花了两小时，产出了一颗好牙和四个学到东西的人。' }
      ]
    },
    {
      suffix: 'ch_appointment_flood', theme: 'shift', title: '🌙 口腔：预约表被塞成了俄罗斯方块',
      text: '一个上午排了十四个号，其中三个是需要一小时的复杂治疗。前台还在加号。',
      options: [
        { text: '拒绝加号，保证每台治疗的时间', label: '稳妥', effects: { skill: 3, legalRisk: -3, health: 3, money: -3, network: -2 }, resultText: '你在前台系统里点了"停止加号"，前台小姑娘松了口气。当月你的门诊量排名下降了三位，你的返工率也下降了三位。' },
        { text: '全部接下，压缩每台时间', label: '激进', effects: { money: 4, skill: 2, stress: 7, health: -5, legalRisk: 3 }, resultText: '你在四个小时里完成了十七个患者，创下科室纪录。颈椎在第三小时开始报警，你把它理解成"设备提示音"，继续操作。' },
        { text: '和前台重新设计预约规则，按复杂度分时段', label: '团队协作', effects: { network: 5, skill: 2, stress: -3, money: 2 }, resultText: '你花了一个中午做了张排班规则表。第一周大家都嫌麻烦，第二周所有人都在用。管理的本质原来就是把混乱写成表格。' }
      ]
    },
    {
      suffix: 'ch_price_talk', theme: 'communication', title: '💬 口腔：患者问"为什么这么贵"',
      text: '一份种植方案报价出来，患者的表情从期待变成怀疑："隔壁诊所只要一半。"',
      options: [
        { text: '把材料、工艺和长期成本一条条讲清楚', label: '长期主义', effects: { ethics: 5, network: 3, skill: 2, stress: 3 }, resultText: '你画了张对比表，讲了十五分钟。患者最后说"我再考虑一下"，两周后回来做了。信任这个东西的转化周期很长，但转化率不低。' },
        { text: '给出可选的简化方案，尊重预算', label: '均衡', effects: { ethics: 4, money: 2, network: 3, stress: 2 }, resultText: '你做了个降级方案，明确告诉他区别在哪。患者选了中间档，还介绍了两个亲戚过来。诚实定价的复利效应，来得比想象中快。' },
        { text: '简单说"一分钱一分货"，不多解释', label: '激进', effects: { stress: -3, money: -2, ethics: -3, network: -3 }, resultText: '患者走了，去了隔壁。半年后他带着失败的修复体回来，第一句是"当时你要是多说两句就好了"。你想说我说了，但其实你只说了六个字。' }
      ]
    },
    {
      suffix: 'ch_tech_lab', theme: 'team', title: '🤝 口腔：技工室发来的第三次返工',
      text: '修复体的边缘又不对。技工说是你的印模问题，你觉得是加工问题。患者已经跑了三趟。',
      options: [
        { text: '亲自去技工室，把流程一起走一遍', label: '团队协作', effects: { network: 5, skill: 4, stress: 3 }, resultText: '你在技工室待了一下午，发现问题出在中间的消毒环节。这个发现让全科的返工率降了一半，也让你和技工师傅成了朋友。' },
        { text: '重做印模，用自己能控制的环节兜底', label: '稳妥', effects: { skill: 4, ethics: 3, stress: 4, money: -2 }, resultText: '第四次终于合适了。患者说"辛苦你了"，你笑了笑没解释。有些质量控制是在看不见的地方完成的，解释起来太费劲。' },
        { text: '按流程提交质量反馈单，让制度去处理', label: '均衡', effects: { legalRisk: -3, network: -2, stress: -2 }, resultText: '反馈单提交了，三周后收到一封格式规范的回复，写着"已知悉并加强管理"。患者的第四趟还是你自己跑的。' }
      ]
    },
    {
      suffix: 'ch_career_private', theme: 'career', title: '📈 口腔：公立与私立之间那道门',
      text: '一家连锁口腔开出了三倍薪资，附加条件是业绩考核和患者转化率。',
      options: [
        { text: '认真了解后接受，去更市场化的平台', label: '激进', effects: { money: 8, network: 4, stress: 5, ethics: -3 }, flagsSet: ['consider_switching_specialty'], resultText: '你签了合同，第一个月的收入让你重新认识了自己的价值。第三个月，运营经理开始跟你讨论"客单价提升空间"，你重新认识了"价值"这个词。' },
        { text: '留在公立，把学科和资历慢慢做深', label: '稳妥', effects: { skill: 4, ethics: 4, stress: -2, money: -2 }, resultText: '你拒绝了三倍薪资，选择了三倍的时间。同事说你想不开，五年后你成了本地颌面外科的常规会诊人选——公立平台的复利，只对熬得住的人生效。' },
        { text: '谈一个多点执业方案，两边都不放弃', label: '均衡', effects: { money: 5, network: 5, stress: 5, health: -3 }, resultText: '你把周末卖给了私立，把工作日留给了公立。收入曲线漂亮了，休息日曲线归零了。多点执业的关键词是"多点"，不是"执业"。' }
      ]
    }
  ]);

  addChapterEvents('ent_oph', [
    {
      suffix: 'ch_micro_surgery', theme: 'clinical', title: '🔬 眼耳鼻喉：显微镜下的一毫米',
      text: '视野里的结构比头发丝还细，你的每一次呼吸都会让画面晃一下。',
      options: [
        { text: '放慢节奏，用呼吸控制稳住每一步', label: '稳妥', effects: { skill: 4, legalRisk: -3, stress: 5, health: -2 }, resultText: '你学会了在关键动作时屏气三秒。这个技巧没有写在任何教材里，是上级用一句"你喘什么"教会你的。' },
        { text: '主动申请多做几台，靠量堆出手感', label: '激进', effects: { skill: 5, stress: 6, health: -5 }, resultText: '你的手感确实上来了，代价是每天晚上眼前都还有显微镜的圆形视野。同事说这叫职业烙印，眼科医生的浪漫大概就是这么朴素。' },
        { text: '录下自己的操作视频，回去逐帧复盘', label: '长期主义', effects: { skill: 4, research: 3, stress: 2 }, resultText: '你看自己的第一台录像时全程尴尬，看到第十遍时开始发现问题。这套自我复盘的方法后来被科里学了去，还起了个名字叫"回放教学法"。' }
      ]
    },
    {
      suffix: 'ch_clinic_volume', theme: 'shift', title: '🌙 眼耳鼻喉：一上午八十个号',
      text: '专家门诊的号排到了走廊，平均每个患者你有三分十二秒。',
      options: [
        { text: '严格控制单个时长，保证所有人都看上', label: '均衡', effects: { skill: 3, stress: 5, health: -3 }, resultText: '你看完了八十个，最后一个患者是下午一点二十。你的喉咙哑了，这在耳鼻喉科算是一种黑色幽默。' },
        { text: '把复杂的转到专病门诊，简单的快速处理', label: '稳妥', effects: { skill: 3, network: 3, stress: -3, legalRisk: -2 }, resultText: '分流之后节奏顺了很多。有患者抱怨"怎么又让我改天来"，你想解释三分钟真的看不了他的病，但那样就只剩两分钟了。' },
        { text: '主动加号看完所有等候的人', label: '激进', effects: { ethics: 4, network: 3, stress: 7, health: -5 }, resultText: '你把最后一个号看完时，保洁阿姨已经开始拖地。她说"你们医生真辛苦"，你说习惯了。这三个字是医生最常用也最不该用的自我安慰。' }
      ]
    },
    {
      suffix: 'ch_expectation_gap', theme: 'communication', title: '💬 眼耳鼻喉：患者以为手术能"恢复如初"',
      text: '术前谈话时患者反复确认："做完就跟以前一样了对吧？"你知道答案是"接近，但不是"。',
      options: [
        { text: '把预期一次讲透，哪怕对方失望', label: '长期主义', effects: { ethics: 6, legalRisk: -5, stress: 4, network: -2 }, resultText: '患者的表情肉眼可见地垮下去，最后还是签了字。术后他说"你当时说得对"。这五个字比任何锦旗都值钱，因为它意味着没有纠纷。' },
        { text: '给出乐观但留有余地的说法', label: '均衡', effects: { stress: -2, legalRisk: 4, ethics: -2 }, resultText: '你用了"通常""大部分""个体差异"这些安全词。手术效果不错，但患者术后一直在追问"为什么还有一点点"。你为当初省下的五分钟，付出了后来的五次门诊。' },
        { text: '用真实案例照片和数据来说明', label: '团队协作', effects: { ethics: 5, skill: 3, network: 3, stress: 2 }, resultText: '你调出了科室的术后随访数据，一张张给他看。数据比语言更有说服力，尤其当它连不完美的部分也一起展示的时候。' }
      ]
    },
    {
      suffix: 'ch_equipment_queue', theme: 'team', title: '🤝 眼耳鼻喉：设备排队与科室博弈',
      text: '全院只有两台那个设备，三个科室都想用，排期表已经成了一份外交文件。',
      options: [
        { text: '牵头制定共享排期规则', label: '团队协作', effects: { network: 6, skill: 2, stress: 3 }, resultText: '你做了张排期表，考虑了急诊优先、科室配额和临时插队机制。三个科室都不完全满意，这说明你做对了——好的规则从来不让所有人满意。' },
        { text: '靠个人关系抢时段，先保住自己的病人', label: '激进', effects: { network: 3, skill: 3, ethics: -3, stress: 4 }, resultText: '你的病人都排上了，靠的是设备科老师欠你的一个人情。人情用一次少一次，你开始计算自己的"人情余额"，这个念头本身就有点悲凉。' },
        { text: '推动院里申购第三台，走正式流程', label: '长期主义', effects: { network: 4, research: 3, money: -2, stress: 4 }, resultText: '你写了份八页的申购论证，三个月后收到"暂缓考虑"。一年后设备到位了，附件里还是你那份材料。有些事只是慢，不是没用。' }
      ]
    },
    {
      suffix: 'ch_career_subspecialty', theme: 'career', title: '📈 眼耳鼻喉：专病门诊的窗口期',
      text: '科里空出一个专病方向，谁先站上去，未来十年就是谁的。',
      options: [
        { text: '主动申请，把这个方向做成自己的', label: '激进', effects: { skill: 4, network: 4, research: 3, stress: 6, health: -3 }, resultText: '你举了手，然后花了两年时间证明自己举得对。第一年只有零星几个患者，第三年你的专病门诊号提前一周挂完。窗口期的意思是：它只开一次。' },
        { text: '先在旁边积累病例，等条件成熟再上', label: '长期主义', effects: { skill: 4, research: 3, stress: 2 }, resultText: '你选择了先攒够弹药。等到第二次机会来临时，你手里已经有一百二十例的数据。稳妥的代价是等待，回报是不会掉下来。' },
        { text: '不争这个方向，把精力放在手术技术上', label: '稳妥', effects: { skill: 5, health: 2, stress: -3, network: -2 }, resultText: '你成了科里技术最好但方向最模糊的人。评职称的时候，"技术好"这三个字在材料上占了半行。你有点不服，但也知道规则就是这么写的。' }
      ]
    }
  ]);

  addChapterEvents('imaging_ultrasound', [
    {
      suffix: 'ch_missed_nodule', theme: 'clinical', title: '🩻 影像：那个差点被略过的影子',
      text: '一天读了三百多份，第两百八十七份的角落里，有一个不到五毫米的东西。',
      options: [
        { text: '停下来放大细看，宁可耽误进度', label: '稳妥', effects: { skill: 4, ethics: 4, legalRisk: -5, stress: 3 }, resultText: '你把它写进了报告的"建议"栏。三周后临床打电话来说确诊了早期，语气里有点激动。影像科的成就感来得很延迟，但来的时候很重。' },
        { text: '按常规标准出报告，保证时效', label: '均衡', effects: { skill: 2, stress: -2, legalRisk: 4 }, resultText: '你的报告时效在全科排前三，这个数据会出现在季度考核里。那个五毫米的影子不会出现在任何考核里，直到有一天它出现在纠纷材料里。' },
        { text: '标记存疑并主动联系临床沟通', label: '团队协作', effects: { network: 5, skill: 3, legalRisk: -4, stress: 2 }, resultText: '你打了个电话，说了三句话。临床医生说"谢谢你专门打过来"。影像科最有价值的输出，有时候不是报告，是那个电话。' }
      ]
    },
    {
      suffix: 'ch_report_backlog', theme: 'shift', title: '🌙 影像：报告积压与时效指标',
      text: '系统显示未出报告 214 份，绿色的时效指标条已经变成了红色。',
      options: [
        { text: '按风险分级处理，急的先出', label: '稳妥', effects: { skill: 3, legalRisk: -4, stress: 4 }, resultText: '你先清了急诊和住院的，门诊的往后压。时效指标当天还是红的，但没有一个真正着急的人被耽误。你在心里给自己打了个及格。' },
        { text: '加班到深夜，把积压全部清完', label: '激进', effects: { skill: 3, money: 2, health: -6, stress: 7 }, resultText: '凌晨一点四十，最后一份报告发出。指标变绿了，你的眼睛变红了。第二天早上你在读片时揉了三次眼睛——效率和准确率是一对此消彼长的兄弟。' },
        { text: '向科里反映人力问题，要求增援', label: '团队协作', effects: { network: 4, stress: -3, health: 2 }, resultText: '你把工作量数据做成图发到群里，主任回了句"我去说"。两周后来了个进修医生。数据比抱怨管用，这是影像科教会你的第一课。' }
      ]
    },
    {
      suffix: 'ch_clinical_dispute', theme: 'communication', title: '💬 影像：临床说"你报得太保守"',
      text: '一位主治打电话来：“你这个「不排除」到底是排除还是不排除？我怎么跟病人说？”',
      options: [
        { text: '解释影像学的边界，同时给出倾向性意见', label: '长期主义', effects: { skill: 4, network: 4, ethics: 3, stress: 3 }, resultText: '你说"从影像看更倾向 A，但需要结合临床"，然后加了一句"如果是我，我会先做这个"。对方说"这就够了"。影像医生最难的不是看片，是把不确定说得有用。' },
        { text: '坚持规范表述，请对方按流程申请会诊', label: '稳妥', effects: { legalRisk: -4, stress: -2, network: -3 }, resultText: '你守住了报告的严谨性，也守住了和临床之间那道墙。墙的两边都很安全，只是病人夹在中间多等了两天。' },
        { text: '约临床医生一起看片，当面讨论', label: '团队协作', effects: { network: 6, skill: 4, stress: 2 }, resultText: '他来了机房，你们对着屏幕聊了二十分钟。他走的时候说"以后有疑难我直接来找你"。这大概是影像科能收到的最高评价。' }
      ]
    },
    {
      suffix: 'ch_ai_assist', theme: 'team', title: '🤝 影像：AI 说这里有问题，你觉得没有',
      text: 'AI 辅助系统在一个位置标了红框，置信度 0.87。你反复看了三遍，觉得那是伪影。',
      options: [
        { text: '坚持自己的判断，并在报告中注明理由', label: '稳妥', effects: { skill: 5, ethics: 4, legalRisk: -3, stress: 4 }, resultText: '你写下了"结合扫描参数考虑为伪影"。随访证明你是对的。AI 的置信度是 0.87，你的置信度是十年的片子——这一局，人赢了。' },
        { text: '按 AI 提示加做一个序列确认', label: '均衡', effects: { skill: 3, legalRisk: -4, stress: 2, money: -2 }, resultText: '加做的序列证明了你的判断，也多花了患者两百块和二十分钟。你开始思考一个新问题：为了给机器一个交代，谁来买单？' },
        { text: '直接采纳 AI 结论，省时省心', label: '激进', effects: { stress: -4, legalRisk: 6, ethics: -3, skill: -2 }, flagsSet: ['ai_overtrust'], resultText: '报告发出去了，临床加做了增强，结果什么都没有。患者投诉多花了钱，你在解释时说"系统提示"。这四个字听起来像理由，其实是免责声明。' }
      ]
    },
    {
      suffix: 'ch_career_platform', theme: 'career', title: '📈 影像：做技术骨干还是做平台建设',
      text: '科里要建区域影像会诊平台，需要有人从读片室走出来做统筹。',
      options: [
        { text: '接下平台建设，把影响力做出机房', label: '长期主义', effects: { network: 6, research: 3, money: 3, stress: 6 }, resultText: '你开始参加各种会议，PPT 做得越来越熟练，片子读得越来越少。一年后区域平台上线，你在庆功宴上想起了那间没有窗户的读片室。' },
        { text: '留在读片室，把亚专科诊断做到顶尖', label: '稳妥', effects: { skill: 5, research: 3, stress: 2, network: -2 }, resultText: '你成了神经影像的第一把手。全院疑难片最后都会流到你桌上，这个位置没有头衔，但有一种更实在的东西：不可替代。' },
        { text: '两头都占，先把话语权拿到手', label: '激进', effects: { network: 5, skill: 3, stress: 8, health: -5 }, resultText: '你白天开会，晚上读片，周末写材料。半年后你在一次会议上把两个专业术语说混了，会场很安静。全能选手的极限，通常是这样被发现的。' }
      ]
    }
  ]);

  addChapterEvents('pathology_lab', [
    {
      suffix: 'ch_borderline_case', theme: 'clinical', title: '🔬 病理：一个说不清是良是恶的切片',
      text: '显微镜下的细胞介于两者之间。临床在等，患者在等，手术方案取决于你这一句话。',
      options: [
        { text: '请上级和外院会诊，宁可慢也要准', label: '稳妥', effects: { skill: 4, ethics: 4, legalRisk: -5, stress: 5, money: -2 }, resultText: '外院会诊回来的意见和你的倾向一致。多花的五天让临床催了三次，但那份报告上的每个字都站得住。病理科的时间账，是用手术方案来算的。' },
        { text: '给出倾向性诊断并注明建议随访', label: '均衡', effects: { skill: 3, legalRisk: -2, stress: 3 }, resultText: '你在报告里用了一个精确到令人难受的表述，把不确定性完整传递了出去。临床医生打电话说"看不懂"，你说"看不懂就是重点"。' },
        { text: '按最可能的方向出明确结论', label: '激进', effects: { skill: 3, legalRisk: 6, stress: 4 }, resultText: '你给了一个干脆的答案，临床很满意。半年后复发病例回来复核，你在灯下重新看那张切片，看了很久很久。' }
      ]
    },
    {
      suffix: 'ch_sample_backlog', theme: 'shift', title: '🌙 病理/检验：标本堆到了走廊',
      text: '一台设备坏了，另一台在排队维保。标本量没有减少，报告时限也没有延长。',
      options: [
        { text: '按临床紧急程度重排，主动告知延期', label: '稳妥', effects: { legalRisk: -4, network: 3, stress: 4 }, resultText: '你给每个相关科室打了电话说明情况。有两个人抱怨，五个人说理解。主动沟通不能修好设备，但能修好关系。' },
        { text: '加班手工处理，硬把时限保住', label: '激进', effects: { skill: 3, health: -6, stress: 8 }, resultText: '你们几个人连着熬了三个晚上，时限一天没超。质控报告上写着"运行良好"，没写这四个字背后是四个人的黑眼圈。' },
        { text: '把设备问题正式上报，推动流程改进', label: '团队协作', effects: { network: 5, legalRisk: -3, stress: 2 }, resultText: '你写了份情况说明，附上了三个月的故障记录。设备科终于批了新机器。你发现在医院里推动改变的秘诀是：把痛苦转换成可归档的格式。' }
      ]
    },
    {
      suffix: 'ch_report_explain', theme: 'communication', title: '💬 病理：患者拿着报告直接找到了实验室',
      text: '一位患者绕过临床，直接敲开了病理科的门："我想知道这上面写的到底是什么意思。"',
      options: [
        { text: '耐心解释术语，但不越界谈治疗方案', label: '长期主义', effects: { ethics: 5, network: 3, legalRisk: -3, stress: 3 }, resultText: '你把那几个拉丁词翻译成了人话，然后请他回去找主诊医生谈方案。他临走时说"你是第一个跟我说人话的"。病理科的门很少被敲响，敲响时都很重要。' },
        { text: '按规定请他回临床咨询', label: '稳妥', effects: { legalRisk: -4, stress: -2, ethics: -2 }, resultText: '你说了句"请您回主诊那边"，然后关上了门。规定是这么写的，但那个人在走廊上站了很久的背影，你从猫眼里看到了。' },
        { text: '联系他的主诊医生，三方一起说明', label: '团队协作', effects: { network: 5, ethics: 4, stress: 2 }, resultText: '你打了个电话，十分钟后临床医生下来了。三个人在小会议室聊了半小时。跨部门协作最有效的形式，往往就是有人愿意多走那十步路。' }
      ]
    },
    {
      suffix: 'ch_quality_control', theme: 'team', title: '🤝 检验：室间质评的成绩出来了',
      text: '有一个项目不合格。科里开始找原因，也开始找"是谁那天值班"。',
      options: [
        { text: '推动系统性排查，不停留在追责', label: '团队协作', effects: { network: 6, skill: 4, legalRisk: -4, stress: 4 }, resultText: '你把整个流程画成了一张图，最后发现问题出在试剂的运输温度。没有人被追责，问题被解决了。这两件事同时发生的概率不高，你争取到了。' },
        { text: '如实说明自己那天的操作细节', label: '稳妥', effects: { ethics: 5, legalRisk: -3, stress: 4, network: -2 }, resultText: '你举手说"那天是我"。会议室安静了两秒，然后主任说"好，我们看看流程哪里有洞"。承认是需要勇气的，但也需要一个不会立刻砍人的环境。' },
        { text: '低调处理，先把复检数据补漂亮', label: '激进', effects: { stress: -3, ethics: -5, legalRisk: 6 }, flagsSet: ['over_controlled_cost'], resultText: '复检数据很漂亮，漂亮到没人再提这件事。你把原始记录锁进了抽屉，也把某种东西一起锁了进去。' }
      ]
    },
    {
      suffix: 'ch_career_research', theme: 'career', title: '📈 病理/检验：科研合作的橄榄枝',
      text: '临床科室来找你合作课题，条件是提供样本库和病理数据，署名排在中间。',
      options: [
        { text: '谈清署名与数据边界后合作', label: '稳妥', effects: { research: 4, network: 4, ethics: 4, stress: 3 }, resultText: '你在合作前写了一页纸的约定，对方觉得你事多。文章发表时你的名字在该在的位置上，那一页纸值三个作者位。' },
        { text: '主动牵头，把病理数据做成自己的平台', label: '长期主义', effects: { research: 5, network: 5, skill: 3, stress: 6, money: -2 }, resultText: '你花了两年建起一个样本库，从此全院的课题都得先来找你。病理科从后台走到了台前，靠的不是发声，是掌握了原材料。' },
        { text: '婉拒，专心把日常诊断做好', label: '休息', effects: { health: 4, stress: -5, skill: 3, research: -2 }, resultText: '你把科研的邀请挡在门外，日子清净了很多。评职称那年你才发现，清净是有标价的，标价写在"科研工作量"那一栏。' }
      ]
    }
  ]);

  addChapterEvents('psychiatry', [
    {
      suffix: 'ch_risk_assessment', theme: 'clinical', title: '🩺 精神科：风险评估的那条线',
      text: '你需要判断这位来访者当下的风险等级。量表给出一个分数，你的直觉给出另一个。',
      options: [
        { text: '按更高风险处理，安排加强观察', label: '稳妥', effects: { ethics: 6, legalRisk: -5, skill: 3, stress: 5 }, resultText: '你选择了保守一侧。事后证明确有必要。精神科的很多判断没有影像和化验可以复核，只能靠你愿不愿意为"万一"多做一步。' },
        { text: '按量表结果处理，同时缩短复诊间隔', label: '均衡', effects: { skill: 3, legalRisk: -2, stress: 3 }, resultText: '你在量表和直觉之间做了个折中，把下次见面提前到了三天后。这三天你查了两次记录系统，这个动作你没跟任何人说。' },
        { text: '与家属和团队一起制定安全计划', label: '团队协作', effects: { network: 5, ethics: 5, legalRisk: -4, stress: 3 }, resultText: '你把家属、社工和病房护士拉进了同一个方案里。安全计划写了两页纸，最有用的其实是最后那行电话号码。' }
      ]
    },
    {
      suffix: 'ch_emotional_load', theme: 'shift', title: '🌙 精神科：把别人的故事带回了家',
      text: '连着一周听了太多沉重的事。今晚你躺在床上，脑子里播放的还是白天诊室里的画面。',
      options: [
        { text: '主动接受督导，把情绪处理掉', label: '稳妥', effects: { health: 5, stress: -8, skill: 3, money: -2 }, resultText: '督导老师听你说了四十分钟，只问了三个问题。你走出来时觉得轻了。精神科医生最容易忘的一件事：自己也需要有人听。' },
        { text: '硬扛，靠时间自己消化', label: '激进', effects: { skill: 2, stress: 7, health: -6 }, resultText: '你以为自己扛得住，直到某天在诊室里对一位来访者失去了耐心。那一刻你知道，共情是有额度的，而你已经透支。' },
        { text: '和同事组建定期同辈支持小组', label: '团队协作', effects: { network: 6, health: 4, stress: -6 }, resultText: '五个人，每周一次，一小时，不谈业务只谈感受。这个小组存活了三年，比科里大部分正式制度都长寿。' }
      ]
    },
    {
      suffix: 'ch_stigma_family', theme: 'communication', title: '💬 精神科：家属说"他就是想太多"',
      text: '家属把病历本推回来："我们家没有这种病，他就是最近压力大。"',
      options: [
        { text: '不争辩，从家属能接受的角度重新说起', label: '长期主义', effects: { ethics: 6, network: 3, skill: 3, stress: 4 }, resultText: '你没有纠正"想太多"这三个字，而是从睡眠和食欲开始聊。四十分钟后家属主动问："那我们要怎么帮他？"有些墙不能推，只能绕。' },
        { text: '摆出诊断依据，坚持规范治疗建议', label: '稳妥', effects: { ethics: 4, legalRisk: -3, stress: 4, network: -2 }, resultText: '你说得完全正确，家属带着人走了。三个月后他们又回来了，情况更重了。正确有时候需要配合时机才能生效。' },
        { text: '请社工和同伴支持一起做家庭工作', label: '团队协作', effects: { network: 5, ethics: 5, stress: 2 }, resultText: '社工用了一句你说不出口的话："我们不是要给他贴标签，是要让他能睡个觉。"家属点头了。团队的价值在于，总有人能找到那把钥匙。' }
      ]
    },
    {
      suffix: 'ch_ward_team', theme: 'team', title: '🤝 精神科：病房里的一次意外',
      text: '一位患者在病区情绪激动，护士按流程处理了，但事后有人质疑处置过当。',
      options: [
        { text: '完整还原经过，支持一线同事', label: '团队协作', effects: { network: 6, ethics: 5, legalRisk: -3, stress: 4 }, resultText: '你在复盘会上把时间线一分钟一分钟摆出来，包括那些"看起来不太好看"的部分。护士后来说，那天你说的话让她敢继续上班。' },
        { text: '推动完善约束与记录规范', label: '长期主义', effects: { legalRisk: -5, skill: 3, network: 3, stress: 4 }, resultText: '你牵头改了流程，加了三个记录节点。全科开始抱怨"又多了表格"，但一年后一次投诉里，正是这三个节点救了大家。' },
        { text: '保持中立，等调查结论', label: '均衡', effects: { legalRisk: -2, stress: -2, network: -3 }, resultText: '你什么都没说，等来了一个不温不火的结论。护士也什么都没说，只是从那以后遇到事会先看你一眼再决定要不要开口。' }
      ]
    },
    {
      suffix: 'ch_career_community', theme: 'career', title: '📈 精神科：从诊室走向社区',
      text: '区里要建心理健康服务网络，问你愿不愿意兼任技术指导。钱不多，事不少。',
      options: [
        { text: '接下来，把服务网络真正建起来', label: '长期主义', effects: { ethics: 6, network: 5, skill: 3, stress: 5, money: -2 }, resultText: '两年后区里的转介流程能跑通了，你在会上被点名表扬三十秒。这三十秒背后是七十次下社区，但你还是觉得值。' },
        { text: '只做技术指导，不承担行政事务', label: '稳妥', effects: { network: 3, skill: 3, stress: -2 }, resultText: '你划清了边界，也保住了周末。有人说你不够投入，你说投入是要按小时计算的，而我的小时数已经卖完了。' },
        { text: '婉拒，专注门诊与个案质量', label: '均衡', effects: { skill: 4, health: 3, stress: -4, network: -3 }, resultText: '你把时间留给了诊室里的那些人。你的患者随访率是全科最高的，这个数据不在任何评优标准里，但你自己知道它意味着什么。' }
      ]
    }
  ]);

  addChapterEvents('general_practice', [
    {
      suffix: 'ch_undifferentiated', theme: 'clinical', title: '🩺 全科：患者说"就是浑身不舒服"',
      text: '没有明确的主诉，没有典型的体征，只有一个说不清楚哪里不对的人坐在你面前。',
      options: [
        { text: '系统问诊 + 建立随访计划', label: '长期主义', effects: { skill: 4, ethics: 4, stress: 3 }, resultText: '你问了二十分钟，什么都没查出来，但约了两周后复诊。第二次见面时她说"上次说完就好多了"。全科的诊疗手段里，"被认真听"是排名很靠前的一种。' },
        { text: '开一套基础检查先排除器质性问题', label: '稳妥', effects: { skill: 3, legalRisk: -3, money: -2, stress: 2 }, resultText: '检查全部正常。患者拿着报告问"那我到底怎么了"，你意识到排除法只解决了一半问题，另一半需要时间和信任。' },
        { text: '转诊到上级医院让专科去查', label: '均衡', effects: { network: 3, stress: -3, ethics: -2 }, resultText: '你写了转诊单。三个月后她又回来了，带着五个专科的报告和更多的困惑。你开始理解基层医生存在的意义：有人得负责把碎片拼回一个人。' }
      ]
    },
    {
      suffix: 'ch_home_visit', theme: 'shift', title: '🌙 全科：一次雨天的上门随访',
      text: '签约居民里有位老人三个月没来复诊，电话打不通。外面在下雨。',
      options: [
        { text: '骑车过去看一眼', label: '稳妥', effects: { ethics: 6, network: 4, health: -3, stress: 2 }, resultText: '老人在家，降压药吃完了没人帮买。你顺手带了两盒过去。这件事不会出现在任何绩效表上，但整条街的人后来都认识你。' },
        { text: '联系居委会和家属协助上门', label: '团队协作', effects: { network: 6, ethics: 4, stress: -2 }, resultText: '居委会的干事比你更熟这栋楼，十分钟就找到了人。你意识到基层医疗的战斗力，一半来自你不认识的那些人。' },
        { text: '记录在案，等下次随访周期', label: '均衡', effects: { stress: -3, ethics: -3, legalRisk: 2 }, resultText: '你在系统里点了"联系不上"。两个月后老人因为血压问题住了院。那个下拉菜单里有很多选项，但没有一个叫"我当时应该去的"。' }
      ]
    },
    {
      suffix: 'ch_trust_building', theme: 'communication', title: '💬 全科：居民说"你们这里能看什么"',
      text: '一位新搬来的居民站在门口打量社区卫生服务中心，语气里有明显的不信任。',
      options: [
        { text: '不解释，先把这次的病看好', label: '长期主义', effects: { skill: 3, ethics: 5, network: 4, stress: 2 }, resultText: '你花了十五分钟处理了一个其实五分钟能搞定的问题。他走的时候说"下次我还来"。基层的信任不是宣传出来的，是一次一次积累出来的。' },
        { text: '认真介绍中心的能力边界和转诊通道', label: '稳妥', effects: { ethics: 4, network: 3, stress: 2 }, resultText: '你告诉他哪些我们能做，哪些必须去上级医院。他有点意外："你们还会说自己不行？"诚实在基层是一种稀缺的竞争力。' },
        { text: '简单处理，反正他也不会常来', label: '均衡', effects: { stress: -3, ethics: -4, network: -3 }, resultText: '三分钟结束，他确实没再来。你在年底签约率统计表前想起了这个人，以及另外几十个类似的三分钟。' }
      ]
    },
    {
      suffix: 'ch_referral_network', theme: 'team', title: '🤝 全科：上级医院的那个联系人',
      text: '一位患者需要尽快转上去，但走正规流程要排三周。你手机里有一个可能有用的号码。',
      options: [
        { text: '打这个电话，同时补齐正式转诊材料', label: '均衡', effects: { network: 5, skill: 3, ethics: 3, stress: 3 }, resultText: '患者三天后就住上了院，正式材料一份没少。你把这条路径记了下来，后来变成了中心和上级医院之间的固定通道。' },
        { text: '推动建立正式的绿色转诊通道', label: '长期主义', effects: { network: 6, ethics: 5, stress: 5, skill: 2 }, resultText: '你跑了四次上级医院，开了三次会，签了一份协议。从此不用再靠私人号码。制度化的意思就是：让好事不依赖于某个人还在不在。' },
        { text: '按流程排队，一切照章办事', label: '稳妥', effects: { legalRisk: -3, stress: -2, ethics: -2 }, resultText: '三周后患者转上去了，病情比当初重了一些。流程没有任何问题，你在心里给这个流程记了一笔账。' }
      ]
    },
    {
      suffix: 'ch_career_policy', theme: 'career', title: '📈 全科：政策岗位的邀请',
      text: '区卫健委在找懂基层的人，问你有没有兴趣过去做几年。事情多，但能影响更大的面。',
      options: [
        { text: '去，把基层的真实情况带进政策', label: '长期主义', effects: { network: 6, ethics: 5, money: 3, stress: 5, skill: -2 }, flagsSet: ['public_admin'], resultText: '你去了，开始写文件、开会、汇总数据。有一次你在文件里加了一句"应保证家庭医生实际随访时间"，那句话后来落到了三十万人身上。' },
        { text: '留在中心，把这块地做深做实', label: '稳妥', effects: { ethics: 5, skill: 4, network: 3, stress: -2 }, flagsSet: ['community_trust'], resultText: '你选择了留下。十年后这个社区的慢病控制率是全区第一，而你依然记得每一位签约老人的名字。影响力有两种形态，你选了更慢的那种。' },
        { text: '两边兼顾，做政策也不放下门诊', label: '激进', effects: { network: 5, skill: 3, money: 2, stress: 7, health: -4 }, resultText: '你的日程表上一半是会议一半是门诊，两边都觉得你不够专心。半年后你在一次会上把患者的名字叫成了文件编号，当晚决定得减掉一样。' }
      ]
    }
  ]);



  // ===== 规培/住院医早期经济压力事件 =====
  const earlyCareerPressureEvents = [
    {
      id: 're_ec_rent_hike_mega', stage: 'training', title: '💸 房东说：明年涨一点',
      text: '合同到期前一个月，房东在微信上发来一句“涨一点点”，后面跟着一个数字，一点也不点。',
      rarity: 'common', weight: 11, returnTo: 'drg_bootcamp',
      conditions: { requireCityTier: ['mega', 'strong_province'] },
      options: [
        { text: '搬到更远的地方，用通勤换房租', label: '稳妥', effects: { money: 8, health: -4, stress: 3 }, flagsSet: ['long_commute'], resultText: '你搬到了地铁末端，房租省下三分之一，通勤时间涨了一倍。你在早高峰的车厢里学会了站着背指南——这大概是本市医生独有的碎片化学习法。' },
        { text: '咬牙续租，保住睡眠时间', label: '均衡', effects: { money: -10, health: 3, stress: 4 }, resultText: '你续了约，钱包薄了，离医院还是十分钟。你安慰自己：这十分钟每天两趟，一年就是一百二十个小时，相当于花钱买命。这个换算让你好受了一点点。' },
        { text: '找同事合租，把成本对半砍', label: '团队协作', effects: { money: 10, network: 4, stress: 2, health: -2 }, resultText: '你和同科室的人合租了。好处是可以互相捎饭，坏处是两个人的排班表贴在冰箱上，看起来像一份作战计划——而且永远没有交集。' }
      ]
    },
    {
      id: 're_ec_exam_fee_stack', stage: 'training', title: '💸 报名费像叠罗汉',
      text: '执业医师考试、规培结业、英语等级、继续教育学分，四张缴费单排着队来。',
      rarity: 'common', weight: 10, returnTo: 'drg_bootcamp',
      options: [
        { text: '全部报名，一次性把资格清干净', label: '激进', effects: { money: -14, skill: 3, stress: 5, health: -2 }, resultText: '你把四张单子一起交了，账户余额变成了一个需要勇气才能看的数字。但至少这一年你不用再被系统提醒“您有待办事项 4 项”。' },
        { text: '按优先级只报必考的', label: '稳妥', effects: { money: -5, skill: 2, stress: 2 }, resultText: '你砍掉了两项“建议参加”。三个月后其中一项变成了“必须参加”，通知发布日期是上周五下午五点半。你已经学会了不为这种事生气。' },
        { text: '申请科室报销与培训经费', label: '团队协作', effects: { money: 5, network: 3, stress: 3 }, resultText: '你填了一张需要三个签字的报销单，跑了两栋楼。钱最后是报下来了，比原计划晚了四个月，中间还被退回一次，理由是"发票抬头多了一个字"。' }
      ]
    },
    {
      id: 're_ec_low_stipend', stage: 'training', title: '💸 规培补贴到账提醒',
      text: '短信提示到账。你看了两遍，确认小数点没有放错位置。',
      rarity: 'common', weight: 11, returnTo: 'drg_bootcamp',
      options: [
        { text: '多值几个班换补助', label: '激进', effects: { money: 9, health: -5, stress: 6, skill: 2 }, resultText: '你把周末排满了，月底多出来的数字刚好够交房租。你算了一下时薪，然后决定以后不再算时薪。' },
        { text: '精打细算，把开销压到最低', label: '稳妥', effects: { money: 5, stress: 4, health: -2 }, resultText: '你开始记账，发现最大的支出是外卖，第二大是咖啡。你把咖啡换成了速溶，然后在第三个夜班时明白了什么叫"节流的边际成本"。' },
        { text: '接受家里补贴一点', label: '均衡', effects: { money: 12, stress: -3, ethics: -2 }, flagsSet: ['family_support'], resultText: '妈妈转账时备注写着"别省着"。你盯着这三个字看了很久，然后默默把钱存进了应急账户。二十八岁还要被转账，这件事的分量比金额重。' }
      ]
    },
    {
      id: 're_ec_commute_cost', stage: 'resident', title: '💸 通勤这笔隐形账',
      text: '你算了算：每天来回三小时，一个月的地铁费加上打车费，等于半个月的伙食预算。',
      rarity: 'common', weight: 9, returnTo: 'ward_rounds',
      conditions: { requireCityTier: ['mega', 'strong_province'] },
      options: [
        { text: '搬到医院附近，贵一点但省时间', label: '均衡', effects: { money: -12, health: 6, stress: -5 }, resultText: '你搬进了一个能听见救护车的房子。房租贵了，但你每天多睡一小时。第一周你还被鸣笛吵醒，第二周你已经能在鸣笛声中做梦了。' },
        { text: '买辆电动车，风里来雨里去', label: '稳妥', effects: { money: -4, health: -3, stress: 2 }, resultText: '你买了辆二手电动车，从此风雨无阻。有天下大雨，你穿着雨衣冲进病区，护士说你像刚从抢救现场回来。你说我确实是。' },
        { text: '维持现状，把通勤时间用来听讲座', label: '长期主义', effects: { skill: 3, stress: 3, health: -3 }, resultText: '你在地铁上听完了整套心电图课程。代价是你现在听到报站声就会想起房室传导阻滞。知识和场景绑定得如此紧密，这在教育学上叫情境记忆，在生活里叫没得选。' }
      ]
    },
    {
      id: 're_ec_registration_paper', stage: 'resident', title: '💸 注册、变更、备案，三件套',
      text: '执业地点变更、多点执业备案、继续教育学分登记，每一项都要跑一趟，每一项都要交一点。',
      rarity: 'uncommon', weight: 8, returnTo: 'ward_rounds',
      options: [
        { text: '请假一天，一次跑完所有窗口', label: '稳妥', effects: { money: -6, stress: 4, health: -2 }, resultText: '你在三个窗口之间跑了六个来回，因为第一个窗口要第三个窗口的回执，而第三个窗口要第一个窗口的证明。你最后是靠打电话给一位办事员的同学解决的。' },
        { text: '找同事帮忙代办，欠个人情', label: '团队协作', effects: { network: 3, money: -3, stress: -3 }, resultText: '同事顺手帮你带了材料，回来说"下次帮我值个班"。这笔交易的汇率大概是：一天假期换一个夜班，你觉得不亏。' },
        { text: '拖着不办，先应付眼前的事', label: '激进', effects: { stress: -3, legalRisk: 5, money: 2 }, resultText: '你把材料压在抽屉最底层。三个月后系统提示"执业信息异常"，你才知道有些拖延不是省时间，只是把利息记在了别处。' }
      ]
    },
    {
      id: 're_ec_housing_provided', stage: 'training', title: '💸 单位宿舍的意外惊喜',
      text: '医院给规培生安排了宿舍。房间不大，但房租那一栏写着"免"。',
      rarity: 'uncommon', weight: 8, returnTo: 'drg_bootcamp',
      conditions: { requireHospitalTier: ['prefecture_tier3_strong2', 'regular_tier2', 'county_basic'] },
      options: [
        { text: '住进去，把省下的钱存起来', label: '稳妥', effects: { money: 14, stress: -4, health: 2 }, flagsSet: ['low_cost_city'], resultText: '你搬进了一间只有八平米的房间，室友是隔壁科的规培生。你们共用一个插座，也共用一种"至少不用交房租"的踏实感。' },
        { text: '住宿舍但把省下的钱投到进修上', label: '长期主义', effects: { money: 6, skill: 4, network: 3, stress: 3 }, resultText: '你把省下的房租换成了两次进修班的报名费。同期笑你"住宿舍还这么卷"，三年后那两次进修变成了你简历上唯一不平凡的两行。' },
        { text: '还是想有自己的空间，出去租', label: '均衡', effects: { money: -8, health: 4, stress: -5 }, resultText: '你租了个一居室，第一次拥有可以摔门的空间。房租吃掉了大半补贴，但你在下夜班后能一个人躺着发呆，这个体验被你评估为"物有所值"。' }
      ]
    },
    {
      id: 're_ec_talent_subsidy', stage: 'resident', title: '💸 人才补贴申报通知',
      text: '人事处群里发了通知：符合条件者可申报青年人才生活补贴，附件是一份 17 页的申报指南。',
      rarity: 'uncommon', weight: 8, returnTo: 'ward_rounds',
      options: [
        { text: '认真准备材料申报', label: '稳妥', effects: { money: 16, stress: 5, network: 3 }, resultText: '你花了三个晚上填完了所有表格，其中一张要求填写"近五年主要贡献"，你在那个格子里写了又删删了又写。补贴半年后到账，比预期少一点，但确实是笔真钱。' },
        { text: '拉上同批的人一起研究政策', label: '团队协作', effects: { money: 12, network: 6, stress: 2 }, resultText: '你们建了个群，把 17 页指南拆成了一份人话版摘要。这份摘要后来在全院流传，你成了那个"懂政策的人"——一个听起来不太像医生的头衔。' },
        { text: '看了两页附件就放弃了', label: '休息', effects: { stress: -5, health: 3, money: -2 }, resultText: '你在第三页的"申报人须同时满足以下六项条件"处关掉了 PDF。放弃的那一刻你很轻松，年底看到同事晒补贴时又不太轻松。' }
      ]
    },
    {
      id: 're_ec_overtime_pay', stage: 'resident', title: '💸 加班费和它的计算公式',
      text: '财务下发了新的绩效说明，里面有一个包含七个变量的公式。有人算出自己该多拿，有人算出自己该倒贴。',
      rarity: 'common', weight: 9, returnTo: 'ward_rounds',
      options: [
        { text: '多接夜班，把绩效冲上去', label: '激进', effects: { money: 11, health: -6, stress: 7, skill: 2 }, resultText: '你的绩效排名上了科室前三，体重掉了四斤。财务说你这个月是"贡献突出"，你在心里把这四个字翻译成了"透支到位"。' },
        { text: '仔细核对公式，发现漏算主动申诉', label: '稳妥', effects: { money: 7, network: -2, stress: 4 }, resultText: '你把公式拆开算了三遍，发现夜班系数确实漏了。申诉之后补发了，财务说"你是第一个算出来的"。你不确定这是表扬。' },
        { text: '不看了，反正也改不了', label: '休息', effects: { stress: -4, health: 3, money: -2 }, resultText: '你把绩效说明扔进了收藏夹里那个叫"以后再看"的文件夹。那个文件夹现在有两百多个文件，是你职业生涯最诚实的记录。' }
      ]
    },
    {
      id: 're_ec_partner_income', stage: 'resident', title: '💸 伴侣说：这个月我来',
      text: '月底账单发过来时，伴侣先转了一笔钱，附言："你这个月值了九个班。"',
      rarity: 'uncommon', weight: 9, returnTo: 'ward_rounds',
      requireFlags: ['has_partner'],
      options: [
        { text: '坦然接受，把家庭当作一个整体', label: '均衡', effects: { money: 14, stress: -6, health: 3 }, resultText: '你接受了，也在心里记了一笔。家庭财务从"你的我的"变成"我们的"这一步，比很多职称评审都难跨过去。' },
        { text: '坚持 AA，但答应多分担家务', label: '稳妥', effects: { money: -4, stress: 2, ethics: 3, network: 2 }, resultText: '你坚持了自己的原则，代价是接下来一个月你在下夜班后还要洗碗。对方说"你这是何苦"，你说这叫尊严，然后打翻了一个盘子。' },
        { text: '接受并承诺以后加倍补回来', label: '长期主义', effects: { money: 10, stress: -3, network: 3, health: 2 }, resultText: '你说"等我熬出头"。对方笑了笑没说话。那个笑容里有信任，也有一点点"我听过很多次了"的意思。' }
      ]
    },
    {
      id: 're_ec_move_cheaper_city', stage: 'resident', title: '💸 换个城市，重新算账',
      text: '有人给你算了一笔账：去二线城市，收入少两成，房价少六成。这个算术题看起来没有悬念。',
      rarity: 'uncommon', weight: 7, returnTo: 'ward_rounds',
      conditions: { requireCityTier: ['mega', 'strong_province'] },
      options: [
        { text: '认真考虑，联系目标城市的医院', label: '长期主义', effects: { money: 12, health: 5, stress: -6, network: -4 }, flagsSet: ['low_cost_city', 'consider_relocation'], resultText: '你投了三份简历，其中一家当天就回复了。你忽然意识到，自己在这座超大城市里排不上号的资历，在别处是被抢的。这个认知有点复杂。' },
        { text: '留下来，赌这个平台的未来', label: '激进', effects: { skill: 4, network: 4, stress: 6, money: -6 }, resultText: '你决定留下。理由是这里有全国最好的病例和最难挂的号。代价是你的存款曲线在未来五年会保持一条优雅的水平线。' },
        { text: '先不动，把简历和人脉都准备好', label: '稳妥', effects: { network: 4, stress: -2, money: 2 }, flagsSet: ['transfer_ready'], resultText: '你更新了简历，加了三个外地同行的微信，然后继续上班。有退路的人上班时腰杆会直一点，这是一种很难量化但确实存在的效应。' }
      ]
    },
    {
      id: 're_ec_scholarship_late', stage: 'training', title: '💸 那笔迟到的奖学金',
      text: '两年前申请的专项培养资助终于批下来了，通知里写着"请于本月内完成领取手续"。',
      rarity: 'rare', weight: 5, returnTo: 'drg_bootcamp',
      options: [
        { text: '去领，顺便把手续一次办完', label: '稳妥', effects: { money: 15, stress: 2, health: -2 }, resultText: '你请了半天假去办手续，被要求补交一份两年前的证明。你在旧邮箱里翻了四十分钟找到了它，这一刻你感谢了当年那个不删邮件的自己。' },
        { text: '把这笔钱投进设备和学习', label: '长期主义', effects: { money: 5, skill: 5, research: 3, stress: 2 }, resultText: '你买了一台像样的笔记本电脑和两个正版软件授权。从此写论文时不用再和自动关机赛跑，这份幸福感是纯粹的。' },
        { text: '拿去还掉学生贷款', label: '均衡', effects: { money: 12, stress: -8, ethics: 3 }, resultText: '你把余额清零的那条短信截了图。没发给任何人，只是自己看了三遍。有些成就没有证书，只有一条短信。' }
      ]
    },
    {
      id: 're_ec_medical_bill_family', stage: 'resident', title: '💸 家里来的电话',
      text: '父亲住院了。电话那头说"不严重"，但同时把住院费的截图发了过来。',
      rarity: 'uncommon', weight: 8, returnTo: 'ward_rounds',
      options: [
        { text: '立刻转钱，并托同行帮忙看着', label: '均衡', effects: { money: -18, network: 3, ethics: 5, stress: 6 }, resultText: '你转了钱，也给老家的同学打了电话。当医生最实用的技能之一，是知道该给谁打这个电话。这项技能不在任何考纲里。' },
        { text: '请假回去一趟，亲自安排', label: '稳妥', effects: { money: -12, health: -3, stress: 4, ethics: 6 }, flagsSet: ['family_care_duty'], resultText: '你请了三天假，走的时候科里没人说什么，但排班表上你的名字被红笔圈了。你在高铁上想：救别人的父母是本职，救自己的父母要请假。' },
        { text: '远程指导治疗方案，人先不回', label: '激进', effects: { skill: 3, stress: 8, ethics: -3, health: -3 }, resultText: '你在值班室里对着 CT 片子跟老家医生沟通了四十分钟，方案很专业。挂断后你坐了很久——专业能解决很多问题，但解决不了你不在场这件事。' }
      ]
    }
  ];

  // ===== 健康与恢复事件 =====
  const healthLifeEvents = [
    {
      id: 're_hl_sleep_debt', stage: 'resident', title: '🏥 睡眠债的利滚利',
      text: '你已经连续三周平均睡五小时。今天在电梯里，你对着关闭的门按了三次开门键。',
      rarity: 'common', weight: 10, returnTo: 'ward_rounds',
      options: [
        { text: '调整作息，强制固定睡眠时间', label: '休息', effects: { health: 8, stress: -7, skill: -1 }, resultText: '你把手机放到了客厅，第一晚失眠到两点，第五晚睡了七小时。你发现睡眠这件事和病人依从性一样——道理都懂，执行才是难点。' },
        { text: '靠咖啡和意志力继续顶', label: '激进', effects: { skill: 2, health: -7, stress: 6 }, resultText: '你把咖啡从一天两杯加到四杯，然后发现自己在四杯的状态下依然能在读片时睡着。人体是有极限的，咖啡因不是解决方案，只是延期通知。' },
        { text: '和排班的人聊聊，把连班拆开', label: '团队协作', effects: { health: 5, stress: -5, network: 2 }, resultText: '你去找了排班的老师，她看了一眼表格说"这排得确实不是人干的"，然后改了。你才知道很多不合理只是因为没人说过。' }
      ]
    },
    {
      id: 're_hl_neck_back', stage: 'resident', title: '🏥 颈椎和腰椎的联名抗议',
      text: '早上起床时，你的脖子有三十度是转不过去的。而今天有四台手术/一整天门诊。',
      rarity: 'common', weight: 9, returnTo: 'ward_rounds',
      options: [
        { text: '去康复科认真治疗一次', label: '稳妥', effects: { health: 7, money: -6, stress: -3 }, resultText: '康复科的同事看了你的片子说"你这个是职业性的"，然后加了句"我们科室也一样"。你们对视一眼，笑得很苦。' },
        { text: '贴个膏药继续上班', label: '激进', effects: { skill: 2, health: -6, stress: 5 }, resultText: '膏药很有效，有效到你忘了它只是止痛。三个月后你在弯腰系鞋带时听到了一声脆响，那一刻你想起了这个下午。' },
        { text: '每天挤出二十分钟做拉伸', label: '长期主义', effects: { health: 6, stress: -4, skill: -1 }, resultText: '你在值班室的角落里做拉伸，被路过的实习生看到了。第二周他也跟着做，第三周变成五个人。医院里最容易传染的不是病毒，是自救。' }
      ]
    },
    {
      id: 're_hl_gi_trouble', stage: 'resident', title: '🏥 胃在提意见',
      text: '连续两周中午的饭是在十四点四十吃的。今天它决定不再配合。',
      rarity: 'common', weight: 9, returnTo: 'ward_rounds',
      options: [
        { text: '做个胃镜查清楚', label: '稳妥', effects: { health: 6, money: -7, stress: 2 }, resultText: '报告写着慢性胃炎，医生说"规律饮食就行"。你看着这四个字，觉得它和"多喝热水"属于同一类：完全正确，完全做不到。' },
        { text: '设个闹钟，强制按点吃饭', label: '休息', effects: { health: 5, stress: -4, skill: -1 }, resultText: '你设了个十二点的闹钟，第一天在查房时响了，第二天在手术中响了，第三天你把它改成了震动。但你确实开始按点吃饭了，胜利来之不易。' },
        { text: '备点胃药，先扛过这一阵', label: '均衡', effects: { health: -3, money: -2, stress: 2 }, resultText: '你的白大褂口袋里从此常驻两盒药。同事问你带的什么，你说"续命的"。这句玩笑话在科室里流传开来，因为大家口袋里都有。' }
      ]
    },
    {
      id: 're_hl_exposure', stage: 'resident', title: '🏥 针刺伤那三十秒',
      text: '操作时手一滑，针头擦过了手套。你的第一反应不是疼，是"患者的检查结果是什么来着"。',
      rarity: 'uncommon', weight: 8, returnTo: 'ward_rounds',
      options: [
        { text: '立即按暴露流程处理并上报', label: '稳妥', effects: { health: 3, legalRisk: -5, stress: 5, ethics: 4 }, resultText: '你按流程挤血、冲洗、上报、抽血、开药，全程二十五分钟。感控科的老师说"你处理得很规范"。规范的意思是，接下来三个月你还要复查两次。' },
        { text: '自己处理一下，不想惊动科里', label: '激进', effects: { stress: 7, health: -5, legalRisk: 5 }, resultText: '你冲了两分钟水，然后回去继续干活。接下来的一个月，每次身体有点不舒服你都会多想三秒。这三秒的成本，比上报麻烦得多。' },
        { text: '上报同时推动科室改进操作流程', label: '团队协作', effects: { network: 5, legalRisk: -5, ethics: 5, stress: 3 }, resultText: '你在上报表的"改进建议"栏里认真写了三条。三个月后科室换了带保护鞘的针具。表格终于发挥了它本该有的作用，这在医院里算小概率事件。' }
      ]
    },
    {
      id: 're_hl_burnout', stage: 'resident', title: '🏥 情绪的电量提示',
      text: '你发现自己已经很久没有因为治好一个病人而高兴过了。也没有因为治不好而难过。',
      rarity: 'uncommon', weight: 9, returnTo: 'ward_rounds',
      options: [
        { text: '找心理咨询谈一次', label: '稳妥', effects: { health: 6, stress: -10, money: -6 }, resultText: '咨询师问你"上一次觉得开心是什么时候"，你想了四十秒答不上来。这四十秒的沉默，比任何量表都说明问题。你决定继续来。' },
        { text: '请一次年假，彻底断开', label: '休息', effects: { health: 8, stress: -12, money: -5, skill: -2 }, resultText: '你关掉了工作微信，去了个没什么信号的地方。第三天你才第一次没有下意识摸口袋。回来后同事说你气色好了，你说我只是终于想起自己是个人。' },
        { text: '什么都不做，等它自己过去', label: '均衡', effects: { stress: 6, health: -5, skill: 2 }, resultText: '你继续上班，效率没有下降，甚至更高了——因为你不再在任何事情上花费情绪。这种状态被同事称赞为"稳"，只有你知道它的另一个名字。' }
      ]
    },
    {
      id: 're_hl_sedentary', stage: 'resident', title: '🏥 久坐、久站、以及从不运动',
      text: '体检报告上有三项箭头。医生（也就是你的同事）说：建议加强锻炼。',
      rarity: 'common', weight: 9, returnTo: 'ward_rounds',
      options: [
        { text: '办张健身卡，认真开始运动', label: '长期主义', effects: { health: 8, money: -8, stress: -5 }, resultText: '你办了卡，去了四次，然后卡在钱包里安静地躺了十一个月。第二年你换了策略：下班走楼梯回家。这个方案的坚持率高得多。' },
        { text: '把通勤改成步行/骑行', label: '稳妥', effects: { health: 6, stress: -3, money: 3 }, resultText: '你开始骑车上班，每天四十分钟。三个月后箭头少了一个，你把体检报告拍给爸妈看，他们只关心为什么还有两个。' },
        { text: '先记下来，等不忙了再说', label: '均衡', effects: { stress: -3, health: -4, skill: 2 }, resultText: '你把报告放进抽屉。"等不忙了"这四个字，是医生词典里最大的一句谎话，全国通用，年年有效。' }
      ]
    },
    {
      id: 're_hl_night_recovery', stage: 'resident', title: '🏥 下夜班之后的十二个小时',
      text: '交完班是早上八点。理论上你可以回家睡觉，实际上你还有病历、会议和一个"顺便"。',
      rarity: 'common', weight: 10, returnTo: 'ward_rounds',
      options: [
        { text: '所有事都推到明天，直接回家睡', label: '休息', effects: { health: 7, stress: -6, network: -2 }, resultText: '你在群里发了句"下夜班先撤"，然后关机。醒来时下午四点，天光正好。你发现世界没有因为你睡了八小时而崩塌，这个发现有点治愈。' },
        { text: '把病历写完再走', label: '均衡', effects: { legalRisk: -3, health: -4, stress: 3 }, resultText: '你在十点半写完了最后一份病历，走出大楼时阳光刺得睁不开眼。质控数据保住了，你在公交车上睡过了两站。' },
        { text: '再顶一个白天，反正撑得住', label: '激进', effects: { skill: 3, money: 3, health: -8, stress: 7 }, resultText: '你连着工作了三十二小时。下班时你觉得自己脚下的地面是软的。同事说你真拼，你说我只是不知道怎么拒绝——这句实话没人接。' }
      ]
    },
    {
      id: 're_hl_recovery_rotation', stage: 'resident', title: '🏥 申请一次轮转喘口气',
      text: '科里有个相对轻松的岗位空出来，轮转三个月。有人说这是"养老"，也有人说这是"回血"。',
      rarity: 'uncommon', weight: 7, returnTo: 'ward_rounds',
      options: [
        { text: '申请去，认真把身体养回来', label: '休息', effects: { health: 10, stress: -10, skill: -2, network: -2 }, resultText: '三个月后你回到病区，同事说你像换了个人。你确实换了个人——上一个已经在第七个连班的时候悄悄下线了。' },
        { text: '不去，怕被贴上"不能扛"的标签', label: '激进', effects: { network: 3, stress: 6, health: -5 }, resultText: '你留下了，标签保住了。半年后你在病区走廊上扶着墙站了十秒，没有人看见。有些标签的维护费用，是自己付的。' },
        { text: '去，但同时把这段时间用来写论文', label: '均衡', effects: { health: 5, research: 4, stress: -3 }, resultText: '你在"养老岗"上写完了两篇文章，还顺便把睡眠补回来了。有人说你不会休息，你说这已经是我能想到的最会休息的方式了。' }
      ]
    }
  ];

  // ===== 恋爱与家庭扩展事件 =====
  const romanceLifeEvents = [
    {
      id: 're_rm_lab_partner', stage: 'graduate', title: '💞 实验室里的同频',
      text: '凌晨一点，隔壁课题组那个人还在跑胶。你们同时抬头，同时叹气，同时笑了。',
      rarity: 'common', weight: 12, returnTo: 'paper_deadline',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        { text: '约一顿宵夜，看看能不能聊得来', label: '均衡', effects: { stress: -6, network: 4 }, flagsSet: ['has_partner'], resultText: '你们在楼下的烧烤摊聊到三点，从跑胶聊到人生规划。回宿舍的路上你想：能理解"我在等结果"这四个字的人，其实不多。' },
        { text: '继续做实验，感情的事以后再说', label: '长期主义', effects: { research: 4, stress: 3 }, resultText: '你把这个念头压了下去，专心跑完了那块胶。结果很好看，实验记录本上那一页你后来翻到过好几次，每次都会多停两秒。' },
        { text: '主动约对方一起做课题，先当战友', label: '团队协作', effects: { research: 3, network: 5, stress: -3 }, flagsSet: ['has_partner'], resultText: '你们合作了一个小课题，然后合作了一顿饭，然后合作了周末。爱情有时候是从"这个数据你帮我看看"开始的，这不浪漫，但很真实。' }
      ]
    },
    {
      id: 're_rm_undergrad_club', stage: 'undergrad', title: '💞 社团活动的意外',
      text: '医学生的社团活动通常是急救培训。你在教心肺复苏时，有人一直在偷偷看你。',
      rarity: 'common', weight: 12, returnTo: 'clerkship_intro',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        { text: '主动加个微信', label: '激进', effects: { stress: -5, network: 4 }, flagsSet: ['has_partner'], resultText: '你说"练习记录我发你"，然后加上了微信。三个月后这个人的备注从"急救社"变成了别的。有些关系的起点非常具体：一个假人和三十次按压。' },
        { text: '把培训做好，其他的顺其自然', label: '稳妥', effects: { skill: 4, network: 3, stress: -2 }, resultText: '你认真教完了整场，收获了一片掌声和一个没有发出去的微信。顺其自然的意思在医学生这里通常是：自然而然地没有下文。' },
        { text: '认真准备下次活动，制造再见的机会', label: '长期主义', effects: { network: 5, skill: 3, stress: -3 }, flagsSet: ['has_partner'], resultText: '你策划了第二场活动，理由充分，动机不太纯。第二场结束后你们一起收拾器材，聊了四十分钟。策划案的第一条目标"扩大参与度"，算是超额完成了。' }
      ]
    },
    {
      id: 're_rm_training_shift', stage: 'training', title: '💞 值班室外的等候',
      text: '有人在医院门口等了你两个小时，因为你说"再有十分钟就好"，然后说了十二次。',
      rarity: 'common', weight: 12, returnTo: 'drg_bootcamp',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        { text: '认真道歉，认真开始这段关系', label: '均衡', effects: { stress: -8, health: 4, network: 3 }, flagsSet: ['has_partner'], resultText: '你出来时对方举着一杯已经凉了的奶茶。你说对不起，对方说"我知道你们是这样的"。能提前理解这件事的人，值得你少说十次"再有十分钟"。' },
        { text: '解释清楚这份工作的常态，让对方决定', label: '稳妥', effects: { ethics: 4, stress: -3, network: 2 }, flagsSet: ['has_partner'], resultText: '你把排班表拍给对方看，说"以后大概都这样"。对方看了很久，说"那我以后带本书来等"。这个回答让你在走廊上站了一会儿。' },
        { text: '算了，这样对人家不公平', label: '长期主义', effects: { stress: 6, skill: 3 }, resultText: '你说了"你别等我了"。对方走的时候没回头。你回到值班室继续写病历，那晚的病历写得格外工整。' }
      ]
    },
    {
      id: 're_rm_resident_intro', stage: 'resident', title: '💞 同事介绍的那个人',
      text: '护士长说"我有个亲戚，人挺好的"，然后不等你回答就把微信推了过来。',
      rarity: 'common', weight: 12, returnTo: 'ward_rounds',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        { text: '见一面，反正也没什么损失', label: '均衡', effects: { stress: -5, network: 4 }, flagsSet: ['has_partner'], resultText: '你们约在医院对面的咖啡店，你迟到了二十五分钟。对方说"没事，我看了会儿书"。第二次见面你只迟到了八分钟，这个进步被双方视为好兆头。' },
        { text: '礼貌婉拒，现在实在没精力', label: '稳妥', effects: { stress: 3, skill: 3 }, resultText: '你说"最近科里忙"。护士长说"你们都这么说"，然后把微信收了回去。这句"你们都这么说"，比拒绝本身更让你沉默。' },
        { text: '先聊着，看看合不合适', label: '长期主义', effects: { stress: -3, network: 3 }, flagsSet: ['has_partner'], resultText: '你们聊了两个月的微信，大部分内容是你在深夜发的"刚下班"和对方第二天早上回的"辛苦了"。异步聊天最后变成了同步生活，过程比想象中顺利。' }
      ]
    },
    {
      id: 're_rm_attending_meet', stage: 'senior', title: '💞 三十几岁的新开始',
      text: '一场跨院学术活动之后，有人加了你微信，第一句是："你讲的那个病例，我想再请教一下。"',
      rarity: 'uncommon', weight: 11, returnTo: 'promotion_gate',
      forbidFlags: ['has_partner', 'single_choice'],
      options: [
        { text: '认真回复，然后约了一顿饭', label: '均衡', effects: { stress: -7, network: 5, health: 3 }, flagsSet: ['has_partner'], resultText: '请教病例的话题持续了四十分钟，剩下的两小时聊了别的。你发现三十几岁开始一段关系有个好处：双方都不再假装自己很闲。' },
        { text: '保持专业距离，只谈学术', label: '稳妥', effects: { research: 4, network: 4, stress: 2 }, resultText: '你们合作发了一篇文章，通讯栏并列。你偶尔会想那顿没吃的饭，但很快被下一个截稿日期覆盖了。' },
        { text: '坦白自己的作息，把选择权交给对方', label: '长期主义', effects: { ethics: 4, stress: -4, network: 3 }, flagsSet: ['has_partner'], resultText: '你发了一段很长的话，讲你的排班、你的加班和你的不确定。对方回了两个字："知道。"这两个字比一百句甜言蜜语都有分量。' }
      ]
    },
    {
      id: 're_rm_guarantee_late', stage: 'resident', title: '💞 三十二岁那年的一次意外',
      text: '你已经很久没认真想过这件事了。直到某天下夜班，有个人在楼下递给你一份早餐，说"我妈让我带的，她说你们医生太辛苦"。',
      rarity: 'uncommon', weight: 30, returnTo: 'ward_rounds',
      forbidFlags: ['has_partner', 'single_choice', 'romance_guarantee_used'],
      conditions: { age: { min: 32 } },
      options: [
        { text: '接受这份笨拙的好意，慢慢来', label: '均衡', effects: { stress: -8, health: 5, network: 4 }, flagsSet: ['has_partner', 'romance_guarantee_used'], resultText: '你接过了那份早餐，还是热的。你们后来在一起了，起点是一个包子和一句"我妈让我带的"。不是所有故事都需要浪漫的开场。' },
        { text: '认真开始，把生活重新排进日程', label: '长期主义', effects: { stress: -6, health: 4, skill: -1 }, flagsSet: ['has_partner', 'romance_guarantee_used'], resultText: '你在排班表旁边贴了一张新的表格，上面写着周末。这张表格在接下来一年里被修改了三十七次，但它一直贴在那里。' },
        { text: '感谢，但明确选择一个人过', label: '稳妥', effects: { health: 4, stress: -4, money: 5 }, flagsSet: ['single_choice', 'romance_guarantee_used'], resultText: '你认真地说了谢谢，也认真地说了不。回家路上你买了自己喜欢的花，插在一个人的房间里。一个人过不是失败选项，只是另一个选项。' }
      ]
    },
    {
      id: 're_rm_long_distance', stage: 'resident', title: '💞 异地的第 208 天',
      text: '你们在两个城市，各自值班，各自加班。视频通话经常一个人在说，另一个人已经睡着。',
      rarity: 'uncommon', weight: 10, returnTo: 'ward_rounds',
      requireFlags: ['has_partner'],
      options: [
        { text: '一方申请调动，把两个人凑到一起', label: '长期主义', effects: { stress: -8, health: 4, network: -4, money: -8 }, flagsSet: ['relocated_for_family'], resultText: '最后是你调过去了。放弃了三年的积累，换了一个能一起吃晚饭的城市。有人说不值，你在第一个共同的周末早上觉得挺值。' },
        { text: '维持异地，用假期硬撑', label: '均衡', effects: { stress: 6, money: -8, health: -3 }, resultText: '你们把所有年假都用在了高铁上。一年见了九次，每次三天。你在票夹里存了三十多张票根，这是一种昂贵而具体的爱情。' },
        { text: '坦诚谈一次，决定要不要继续', label: '稳妥', effects: { stress: -5, ethics: 4, health: 2 }, resultText: '你们视频聊了三个小时，把所有不敢说的都说了。结论是继续，但设了个期限。有期限的坚持比无期限的消耗健康得多。' }
      ]
    },
    {
      id: 're_rm_cancelled_date', stage: 'resident', title: '💞 又一次被鸽掉的约会',
      text: '你们订了餐厅，你在出发前十五分钟接到了急会诊电话。这是这个月第三次。',
      rarity: 'common', weight: 10, returnTo: 'ward_rounds',
      requireFlags: ['has_partner'],
      options: [
        { text: '会诊结束后立刻补一次，不管多晚', label: '均衡', effects: { stress: 3, health: -3, network: 3 }, resultText: '你在十一点二十赶到，餐厅已经关门。你们最后在便利店吃了关东煮。对方说"这也算"，你在心里给这三个字打了满分。' },
        { text: '提前和对方约定"医生式约会"规则', label: '长期主义', effects: { stress: -6, ethics: 3, health: 3 }, resultText: '你们定了个规矩：所有约会都不订位、不提前买票、随时可取消。听起来毫无浪漫可言，实际执行下来成功率从三成提到了八成。' },
        { text: '道歉，然后继续被工作牵着走', label: '稳妥', effects: { stress: 5, network: -2 }, resultText: '你发了个红包和一长串道歉。对方回了"没事"，你知道这两个字是有库存的，而库存正在减少。' }
      ]
    },
    {
      id: 're_rm_both_parents', stage: 'resident', title: '💞 两边父母的时间表',
      text: '春节假期只有五天，你的父母在西边，对方的父母在东边，而你还要值一个班。',
      rarity: 'uncommon', weight: 9, returnTo: 'ward_rounds',
      requireFlags: ['married'],
      options: [
        { text: '把双方父母都接过来一起过', label: '团队协作', effects: { money: -12, stress: -4, ethics: 5, network: 4 }, resultText: '你租了个大房子，四位老人在客厅里聊了三天，比你们俩还熟。你在值班室吃盒饭时收到一张全家福，照片里唯一缺的人是拍照的那个。' },
        { text: '轮流回，今年东边明年西边', label: '稳妥', effects: { stress: 3, money: -8, ethics: 3 }, resultText: '你们定了个轮换制度，写在备忘录里。听起来很像排班表，实际上也确实是排班表——只不过这次排的是亲情。' },
        { text: '哪边都不去，两个人在值班室过', label: '均衡', effects: { stress: 5, money: 5, health: -3, network: -3 }, resultText: '你们在值班室煮了速冻饺子，配着心电监护的滴滴声。对方说"这是我过得最安静的一个年"。你分不清这是抱怨还是表扬。' }
      ]
    },
    {
      id: 're_rm_housing_decision', stage: 'resident', title: '💞 租还是买，这是个问题',
      text: '中介说这个价格不会再有了，父母说该定下来了，你的账户说别开玩笑。',
      rarity: 'uncommon', weight: 9, returnTo: 'ward_rounds',
      requireFlags: ['has_partner'],
      options: [
        { text: '咬牙买，背上二十年', label: '激进', effects: { money: -22, stress: 10, health: -3 }, flagsSet: ['debt_burden'], resultText: '你签字的时候手有点抖。从此你每个月最重要的日子是还款日，最害怕的通知是"绩效调整"。房子是你的了，某种意义上你也是房子的了。' },
        { text: '继续租，把钱留在手上', label: '稳妥', effects: { money: 8, stress: -4, health: 2 }, resultText: '你们决定继续租。父母不太理解，你说"我们这行调动很多"。这个理由一半是真的，另一半是你算过首付和自己的年薪之比。' },
        { text: '先在低成本城市买，两地过渡', label: '长期主义', effects: { money: -12, stress: 3, health: 2 }, flagsSet: ['low_cost_city'], resultText: '你们在老家附近买了个小房子，作为"退路"。这个词你以前很不喜欢，现在觉得挺好——有退路的人，在前线才敢往前走。' }
      ]
    },
    {
      id: 're_rm_childcare_plan', stage: 'resident', title: '💞 谁来带孩子',
      text: '孩子快出生了，你们开始面对一个没有标准答案的题：两个人都上夜班，孩子归谁。',
      rarity: 'uncommon', weight: 9, returnTo: 'ward_rounds',
      requireFlags: ['has_child'],
      options: [
        { text: '请老人来帮忙，接受一些磨合', label: '均衡', effects: { stress: -6, money: -5, health: 3, ethics: 2 }, resultText: '老人来了，孩子有人带了，客厅的电视音量从此固定在最大档。你在下夜班后戴着耳塞睡觉，但至少能睡。' },
        { text: '请专业育儿嫂，用钱换时间', label: '激进', effects: { money: -20, stress: -8, health: 4 }, resultText: '育儿嫂的月薪比你高，这个事实你消化了一周。但那一周你睡了六个整觉，于是你决定不再消化，直接接受。' },
        { text: '一方申请减少夜班，主动降速', label: '长期主义', effects: { money: -8, stress: -6, health: 5, network: -3 }, flagsSet: ['career_slowdown'], resultText: '你们商量后决定其中一个人先慢下来。这个决定在职业上是有代价的，在孩子第一次叫人的时候，那个在场的人觉得没有代价。' }
      ]
    },
    {
      id: 're_rm_adoption', stage: 'senior', title: '💞 另一种成为父母的方式',
      text: '你们讨论了很久生育的事，最后有人先提出了另一个选项：领养。',
      rarity: 'rare', weight: 7, returnTo: 'promotion_gate',
      requireFlags: ['married'], forbidFlags: ['has_child'],
      options: [
        { text: '认真启动领养流程', label: '长期主义', effects: { ethics: 8, stress: 4, money: -10, health: 2 }, flagsSet: ['has_child', 'adopted_child'], resultText: '流程比你想象中长，材料比你写过的任何标书都厚。一年半以后，家里多了一个人。第一次听到"爸爸/妈妈"的时候，所有的表格都变得值得。' },
        { text: '选择两个人的生活，不要孩子', label: '稳妥', effects: { money: 10, health: 5, stress: -8 }, flagsSet: ['dink'], resultText: '你们认真讨论后选择了丁克。亲戚不理解，同事偶尔会问。你们把周末用来旅行和睡觉，这个选择的满意度逐年上升。' },
        { text: '再等等，把这件事放一放', label: '均衡', effects: { stress: 3, skill: 3 }, resultText: '你们说"过两年再说"。这句话在接下来的几年里被重复了很多次，直到某一天没有人再提起。有些决定是靠沉默做出的。' }
      ]
    },
    {
      id: 're_rm_partner_migration', stage: 'senior', title: '💞 对方拿到了另一个城市的机会',
      text: '这次不是你，是对方拿到了一个很难拒绝的 offer。地点在一千两百公里之外。',
      rarity: 'uncommon', weight: 9, returnTo: 'promotion_gate',
      requireFlags: ['has_partner'],
      options: [
        { text: '支持对方去，自己想办法跟上', label: '长期主义', effects: { network: -5, stress: 6, ethics: 6, money: -6 }, flagsSet: ['consider_relocation'], resultText: '你说"你去，我来想办法"。这句话说出口很快，落地花了两年。你放弃了副高的第一次机会，换了一个能一起吃饭的城市。' },
        { text: '劝对方留下，把自己的平台守住', label: '激进', effects: { network: 4, stress: 5, ethics: -4, health: -2 }, resultText: '对方留下了，也把那份 offer 的邮件保存在了收藏夹里。你偶尔会想起这件事，尤其是在你们吵架的时候。' },
        { text: '一起做个五年计划，分阶段解决', label: '团队协作', effects: { stress: -5, network: 3, ethics: 4, health: 3 }, resultText: '你们在纸上画了个时间轴，标了四个节点。这份计划后来改了三次，但它至少让"异地"从一个困境变成了一个项目。' }
      ]
    }
  ];

  randomEvents.push(...earlyCareerPressureEvents, ...healthLifeEvents, ...romanceLifeEvents);



  // ===== 转轨与再就业链条 =====
  events.push(
    {
      id: 'career_switch_gateway',
      stage: 'senior',
      major: true,
      title: '转轨窗口：要不要换一条跑道',
      text: '猎头的消息、同学的朋友圈、招聘公告和你昨晚的体检报告，在同一周里指向同一个问题：这条路，你还要跑多久。\n换赛道不等于失败，也不等于解脱——它只是把一组问题换成另一组问题。',
      yearDelta: 1,
      options: [
        {
          text: '看产业与内容方向：药械、临床运营、医学编辑、互联网医疗',
          label: '均衡',
          target: 'career_switch_industry_pick',
          effects: { network: 4, stress: 2, money: -2 },
          flagsSet: ['career_switch_exploring'],
          impactHint: '打开产业方向｜需要重新证明自己',
          resultText: '你把简历改成了非医院版本，第一次发现"熟练掌握三腔二囊管"在产业岗位上并不是加分项。招聘要求那一栏写着"具备跨部门沟通能力"，你想了想，觉得自己在协调床位这件事上确实很有经验。'
        },
        {
          text: '看社会办医方向：民营连锁专科、高端私立、国际部',
          label: '激进',
          target: 'career_switch_private_pick',
          effects: { money: 4, network: 4, stress: 3, ethics: -2 },
          flagsSet: ['career_switch_exploring'],
          impactHint: '收入上升｜合规与业绩压力上升',
          resultText: '对方开出的数字很好看，合同附件里的"业绩考核细则"有十一页。你翻到第七页时看到了"客户转化率"，忽然意识到在那边，患者会有一个新称呼。'
        },
        {
          text: '看公共部门方向：疾控、卫健、公共卫生项目',
          label: '长期主义',
          target: 'career_switch_public_pick',
          effects: { ethics: 5, stress: -3, money: -3, network: 3 },
          flagsSet: ['career_switch_exploring'],
          impactHint: '压力下降｜收入下降｜影响面变大',
          resultText: '你去参加了一场宣讲。台上的人说"我们做的事情，五年之后才看得见效果"。台下有人在打哈欠，你却听进去了——毕竟你已经习惯了做那种十年后才被感谢的工作。'
        },
        {
          text: '留在公立体系，把这次动摇当成一次年检',
          label: '稳妥',
          safeChoice: true,
          target: 'senior_outcome',
          effects: { ethics: 5, health: 3, stress: -6, skill: 4 },
          impactHint: '压力下降｜稳定性上升',
          resultText: '你把猎头的微信设成了免打扰，然后回到病区继续查房。留下不是因为没得选，而是因为你算完账之后发现，自己最舍不得的其实是那几个还在随访的病人。这个理由不够体面，但很真实。'
        }
      ]
    },
    {
      id: 'career_switch_industry_pick',
      stage: 'senior',
      title: '产业方向：四个岗位，四种代价',
      text: 'JD 写得都很漂亮，面试官也都很客气。真正的差别藏在"汇报关系"和"考核周期"这两栏里。',
      yearDelta: 0,
      options: [
        {
          text: '药械企业医学事务（MSL/MA）：做专业与商业之间的翻译',
          label: '均衡',
          target: 'career_switch_probation',
          effects: { money: 12, network: 6, stress: 2, ethics: -3, health: 4 },
          flagsSet: ['switch_industry_ma'],
          career: { hospitalType: 'industry' },
          impactHint: '收入明显上升｜医德轻微下降｜进入试用期',
          resultText: '入职第一周你学会了三个新词：合规、循证支持、以及"这个说法我们不能这样表述"。你把它们记在手机备忘录里，旁边是你还没删掉的值班排表。'
        },
        {
          text: '临床运营 / CRO：把试验流程跑通',
          label: '稳妥',
          target: 'career_switch_probation',
          effects: { money: 9, skill: 3, stress: 3, health: 3 },
          flagsSet: ['switch_ops'],
          career: { hospitalType: 'industry' },
          impactHint: '收入上升｜出差增加｜进入试用期',
          resultText: '你开始满世界跑中心，行李箱里常年备着两套衣服和一沓知情同意书模板。有人问你现在做什么，你说"确保别人做的事情有据可查"，对方点点头，其实没听懂。'
        },
        {
          text: '医学编辑与内容：把专业翻译成人话',
          label: '长期主义',
          target: 'career_switch_probation',
          effects: { money: 4, research: 4, ethics: 4, stress: -4, health: 4 },
          flagsSet: ['switch_content'],
          career: { hospitalType: 'industry' },
          impactHint: '压力下降｜收入小幅上升｜进入试用期',
          resultText: '你写的第一篇科普被编辑打回三次，理由分别是"太专业""太啰嗦""标题不够抓人"。第四稿通过了，阅读量四千七。你算了一下：这相当于连续二十年门诊才能见到的人数。'
        },
        {
          text: '互联网医疗：在线问诊与产品设计',
          label: '激进',
          target: 'career_switch_probation',
          effects: { money: 10, network: 7, stress: 5, ethics: -3, health: 2 },
          flagsSet: ['switch_internet'],
          career: { hospitalType: 'industry' },
          impactHint: '收入明显上升｜压力上升｜进入试用期',
          resultText: '你的工位在一个开放式办公区，周围的人管用户叫"用户"，管转化叫"转化"。第一次线上问诊你打了六百字，产品经理善意提醒："平均回复长度建议控制在一百二十字。"'
        }
      ]
    },
    {
      id: 'career_switch_private_pick',
      stage: 'senior',
      title: '社会办医：钱、患者与合同条款',
      text: '三份合同摆在你面前。薪资一份比一份好看，附加条款也一份比一份长。',
      yearDelta: 0,
      options: [
        {
          text: '民营连锁专科：规模化，但考核到人头',
          label: '激进',
          target: 'career_switch_probation',
          effects: { money: 14, network: 5, stress: 6, ethics: -4, health: -2 },
          flagsSet: ['switch_chain_private'],
          career: { hospitalTier: 'premium_private', hospitalType: 'private' },
          impactHint: '收入大幅上升｜压力上升｜医德下降｜进入试用期',
          resultText: '第一次周会上，运营总监展示了一张"医生产值排行榜"，你的名字在中间偏下。散会后有位同事拍拍你说："别急，前三名都是去年来的。"你不确定这是安慰还是预告。'
        },
        {
          text: '高端私立 / 国际部：服务导向，节奏可控',
          label: '均衡',
          target: 'career_switch_probation',
          effects: { money: 11, stress: -4, health: 5, network: 4, ethics: -2 },
          flagsSet: ['switch_premium_private'],
          career: { hospitalTier: 'international', hospitalType: 'international' },
          impactHint: '收入明显上升｜压力下降｜进入试用期',
          resultText: '你第一次拥有了每位患者三十分钟的门诊时长。第一个患者聊到第二十五分钟时说"你们这里真好"，你笑了笑，心里算的是：在原来那家，这三十分钟可以看十个人。'
        },
        {
          text: '去更需要人的地方：地市/县域医院骨干岗',
          label: '长期主义',
          target: 'career_mobility_county_chief',
          effects: { ethics: 7, network: 5, money: 5, stress: -4, health: 3 },
          flagsSet: ['grassroots_path'],
          career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', hospitalType: 'public_general' },
          impactHint: '医德明显上升｜压力下降｜平台层级下降',
          resultText: '你带着一箱书和一台旧笔记本去报到。院长亲自到门口接你，说的第一句是"我们等这样的人等了三年"。这句话的分量，比你在原单位听过的所有表扬加起来都重。'
        }
      ]
    },
    {
      id: 'career_switch_public_pick',
      stage: 'senior',
      title: '公共部门：慢，但是面很宽',
      text: '一边是疾控和公共卫生项目，一边是卫健系统的岗位。共同点是：都要写材料；不同点是：写给谁看。',
      yearDelta: 0,
      options: [
        {
          text: '进疾控/公共卫生项目，做人群健康',
          label: '长期主义',
          target: 'career_switch_probation',
          effects: { ethics: 7, research: 4, money: -2, stress: -4, health: 4 },
          flagsSet: ['switch_public_health'],
          career: { hospitalType: 'academic_research' },
          impactHint: '医德明显上升｜压力下降｜收入轻微下降',
          resultText: '你的工作从"救这一个"变成了"让这一万个别得病"。成就感变得抽象了很多，唯一具体的是每个月都要交的那份数据报表，它一格都不能空。'
        },
        {
          text: '备考进入卫生健康管理部门',
          label: '均衡',
          effects: { network: 5, stress: 5, money: -4, health: -2 },
          flagsSet: ['public_admin'],
          impactHint: '判定：成功进入体制内｜失败则需重新规划',
          check: {
            baseChance: 54,
            stats: { network: 0.25, ethics: 0.25, research: 0.15, stress: -0.2 },
            minChance: 26,
            maxChance: 86,
            success: {
              target: 'ending_public_service',
              effects: { network: 10, ethics: 6, money: 6, stress: -5 },
              feedback: '笔试面试都过了，你换了一张工作证。',
              log: '判定成功（转轨）：你进入了卫生健康管理部门。',
              resultText: '你在体检表上填"现职业"时犹豫了三秒，最后写了"医师"。三个月后新的工作证下来，照片里的你看起来休息得不错。同事说你有临床背景是优势，你说但愿吧。'
            },
            failure: {
              target: 'career_switch_unemployed',
              effects: { stress: 10, money: -6, health: -3 },
              feedback: '差了几分，而这几分意味着又是一年。',
              log: '判定失败（转轨）：考试没过，你需要重新安排下一步。',
              resultText: '成绩出来那天你看了三遍，确认那个小数点确实在它该在的位置。你已经辞了原来的岗位，现在手上什么都没有——这大概是三十几岁最不适合体验的一种自由。'
            }
          }
        },
        {
          text: '再想想，先回临床把这一年过完',
          label: '稳妥',
          safeChoice: true,
          target: 'senior_outcome',
          effects: { ethics: 4, skill: 4, stress: -4, health: 2 },
          impactHint: '稳定性上升｜维持现状',
          resultText: '你把宣讲会的资料塞进了抽屉。回到病区那天，正好有个老病人来复查，握着你的手说"还好你还在"。你想：所谓路径依赖，有时候只是舍不得。'
        }
      ]
    },
    {
      id: 'career_switch_probation',
      stage: 'senior',
      major: true,
      title: '试用期：新赛道的第一道门槛',
      text: '入职培训第一天，HR 用很温和的语气介绍了"试用期考核标准"和"末位调整机制"。\n你忽然想起在医院时，从来没有人跟你说过"你可能会被淘汰"这件事。',
      yearDelta: 1,
      options: [
        {
          text: '稳扎稳打：先摸清规则，把交付做到及格线以上',
          label: '稳妥',
          safeChoice: true,
          effects: { skill: 3, network: 3, stress: 4, health: -2, money: -2 },
          impactHint: '判定：通过试用期｜失败则转入待业',
          check: {
            baseChance: 74,
            stats: { network: 0.2, skill: 0.2, ethics: 0.15, stress: -0.25 },
            minChance: 48,
            maxChance: 92,
            success: {
              target: 'career_switch_settled',
              effects: { money: 8, network: 5, stress: -4, health: 3 },
              feedback: '转正邮件抄送了整个部门，你的名字第一次出现在组织架构图上。',
              log: '判定成功（试用期）：你通过考核，正式落地新赛道。',
              resultText: '转正那天你收到一封群发邮件，标题是"欢迎正式加入"。你在工位上愣了一会儿——上一次有人正式欢迎你，还是十年前那场白大褂授予仪式，而那次你还得自己买袖标。'
            },
            failure: {
              target: 'career_switch_unemployed',
              effects: { stress: 12, money: -8, health: -4 },
              feedback: 'HR 用同样温和的语气说：我们觉得可能不太匹配。',
              log: '判定失败（试用期）：你没有通过考核。',
              resultText: '谈话安排在周五下午四点，会议室订了三十分钟，实际用了十一分钟。走出大楼时天还亮着，你忽然发现自己已经很多年没有在天亮时下过班了，而这一次是因为没班可下。'
            }
          }
        },
        {
          text: '猛冲：第一个季度就做出能被看见的成绩',
          label: '激进',
          effects: { skill: 4, network: 5, stress: 9, health: -6, money: -3 },
          impactHint: '判定：高回报｜失败直接淘汰｜健康明显下降',
          check: {
            baseChance: 52,
            stats: { network: 0.3, skill: 0.25, research: 0.15, stress: -0.3 },
            minChance: 22,
            maxChance: 86,
            success: {
              target: 'career_switch_settled',
              effects: { money: 14, network: 9, stress: -2 },
              flagsSet: ['switch_fast_track'],
              feedback: '你的第一个项目直接被拿去汇报，老板记住了你。',
              log: '判定成功（试用期）：你用一个季度证明了自己。',
              resultText: '你的项目上了季度汇报的第三页 PPT，老板念了你的名字。散会后有同事过来加微信，说"以后多合作"。你在洗手间的镜子里看了看自己——瘦了六斤，但确实站进去了。'
            },
            failure: {
              target: 'ending_switch_probation_out',
              effects: { stress: 14, health: -8, money: -10 },
              feedback: '你用力过猛，踩到了一个自己完全不知道存在的红线。',
              log: '判定失败（试用期）：激进策略导致你被直接淘汰。',
              resultText: '你越过了两个层级直接汇报，内容没问题，路径有问题。第二天你的账号权限被调整了，第三天 HR 找你谈话。医院里的等级是明的，这里的是暗的——而暗的更硬。'
            }
          }
        },
        {
          text: '两手准备：保留执业注册与临床联系，随时能回去',
          label: '长期主义',
          effects: { ethics: 4, network: 4, stress: 2, money: -4, skill: 2 },
          flagsSet: ['keep_clinical_license'],
          impactHint: '判定：更容易通过｜投入被分散｜保留退路',
          check: {
            baseChance: 66,
            stats: { ethics: 0.2, network: 0.25, skill: 0.2, stress: -0.2 },
            minChance: 38,
            maxChance: 88,
            success: {
              target: 'career_switch_settled',
              effects: { money: 6, network: 5, ethics: 4, health: 3 },
              feedback: '你既站住了新岗位，也没有把旧的桥烧掉。',
              log: '判定成功（试用期）：你在保留退路的前提下完成了转轨。',
              resultText: '你每个月还回原来的医院出半天门诊，同事说你"两头都想要"。你没反驳——因为你确实两头都想要，而且暂时确实都拿住了。'
            },
            failure: {
              target: 'career_switch_unemployed',
              effects: { stress: 9, money: -5, ethics: 3 },
              feedback: '公司觉得你不够投入，这个判断不算错。',
              log: '判定失败（试用期）：投入分散让你没能通过考核。',
              resultText: '离职面谈时对方说："我们感觉你一直有一只脚在外面。"你想说那是因为我不敢把两只脚都放进来，但最后只说了"理解"。留退路的代价，就是别人也会给你留一条。'
            }
          }
        }
      ]
    },
    {
      id: 'career_switch_settled',
      stage: 'senior',
      major: true,
      title: '转轨之后的第三年',
      text: '你已经适应了新的语言体系：里程碑、闭环、颗粒度、对齐一下。\n没适应的是每次听到救护车鸣笛时，身体还是会先紧一下。',
      yearDelta: 2,
      options: [
        {
          text: '往上做，带一支团队',
          label: '激进',
          target: 'ending_switch_industry_lead',
          effects: { money: 16, network: 12, stress: 6, health: -3 },
          impactHint: '收入大幅上升｜压力上升',
          resultText: '你开始参加那种从早开到晚的战略会。有一次你在会上说"这个方案对患者不友好"，全场安静了两秒，然后有人说"这个视角很好"。你不知道那两秒里发生了什么，但你决定继续说下去。'
        },
        {
          text: '把这条线做长做稳，不追求跃迁',
          label: '稳妥',
          safeChoice: true,
          target: 'ending_switch_ops_stable',
          effects: { money: 9, health: 8, stress: -9, ethics: 4 },
          impactHint: '健康明显上升｜压力大幅下降',
          resultText: '你成了部门里最稳的那个人：不抢功，不掉链子，交付永远准时。年终评级是 B+，年终体检全部正常。你把这两张纸并排放在桌上，觉得这个组合比任何一个 A 都好。'
        },
        {
          text: '做医学内容与科普，把专业还给公众',
          label: '长期主义',
          target: 'ending_switch_content_editor',
          effects: { ethics: 9, research: 6, network: 8, money: 3, stress: 2 },
          impactHint: '医德明显上升｜影响力上升｜收入变化不大',
          resultText: '你写的一篇关于用药误区的文章被转发了十几万次。评论区里有人说"看完这个我把家里的药都扔了"，你赶紧又写了一篇《不是让你都扔》。科普这件事的难度在于，你永远无法预测读者会走到哪一步。'
        },
        {
          text: '带着产业经验回临床，做转化与合作',
          label: '团队协作',
          target: 'ending_switch_return_clinic',
          effects: { skill: 8, network: 10, ethics: 6, money: -4, stress: 4 },
          conditions: { anyFlags: ['keep_clinical_license', 'switch_ops', 'switch_public_health'] },
          impactHint: '人脉明显上升｜收入下降｜回到临床',
          resultText: '你回来了，带着一套完全不同的方法论。有人说你"镀了层金"，也有人说你"绕了一大圈"。你自己知道，那圈没白绕——现在你看临床问题时，会自动多想一层"这件事能不能被复制"。'
        }
      ]
    },
    {
      id: 'career_switch_unemployed',
      stage: 'senior',
      major: true,
      title: '空窗期：没有工牌的日子',
      text: '你第一次体会到工作日的上午十点，小区里是什么样子：安静、有阳光、有遛狗的人，以及一种你完全不熟悉的松弛。\n第三天，这种松弛开始变成另一种东西。',
      yearDelta: 1,
      options: [
        {
          text: '重新求职，降薪也接受',
          label: '稳妥',
          safeChoice: true,
          effects: { stress: 5, network: 3, money: -4 },
          impactHint: '判定：重新就业｜失败则长期待业',
          check: {
            baseChance: 82,
            stats: { network: 0.3, skill: 0.2, ethics: 0.15, stress: -0.2 },
            minChance: 42,
            maxChance: 90,
            success: {
              target: 'ending_switch_reemployed',
              effects: { money: 8, stress: -8, network: 5, health: 4 },
              feedback: '第九次面试之后，有人说：下周能来吗。',
              log: '判定成功（再就业）：你重新找到了岗位。',
              resultText: '你投了四十七份简历，收到十一次回复，去了九次面试。第九次结束时对方问"下周能来吗"，你说能。挂断电话后你在楼下坐了十分钟，然后给家里打了个电话，说"找到了"。'
            },
            failure: {
              target: 'ending_switch_long_unemployed',
              effects: { stress: 12, money: -10, health: -6 },
              feedback: '简历石沉大海的次数多到你已经不再刷新邮箱。',
              log: '判定失败（再就业）：求职长期没有结果。',
              resultText: '你把简历改了七版，最后一版把"三甲医院十年临床经验"放到了最上面。HR 说这段经历"很好，但和岗位不太匹配"。你想问那什么才匹配，但对方已经在说"保持联系"。'
            }
          }
        },
        {
          text: '备考公务员/事业单位，赌一个稳定',
          label: '长期主义',
          effects: { stress: 6, money: -6, skill: -2, health: -2 },
          impactHint: '判定：进入体制｜失败则长期待业｜期间无收入',
          check: {
            baseChance: 48,
            stats: { ethics: 0.25, network: 0.2, research: 0.2, stress: -0.25 },
            minChance: 20,
            maxChance: 82,
            success: {
              target: 'ending_public_service',
              effects: { network: 8, ethics: 6, money: 6, stress: -8, health: 4 },
              feedback: '拟录用公示挂出来那天，你反复确认了三遍名字。',
              log: '判定成功（再就业）：你考进了公共部门。',
              resultText: '公示期七天，你每天点开那个页面看一次。第七天下午页面撤了，你的心跳了一下，然后收到了电话。上岸这个词你以前觉得很土，现在觉得非常准确。'
            },
            failure: {
              target: 'ending_switch_long_unemployed',
              effects: { stress: 14, money: -12, health: -6 },
              feedback: '年龄限制那一栏，把很多岗位提前替你筛掉了。',
              log: '判定失败（再就业）：备考没有换来上岸。',
              resultText: '你在职位表里筛来筛去，发现符合专业要求的岗位有十四个，符合年龄要求的有三个，两者交集是一个，而那一个的竞争比是四百八十七比一。你还是报了。'
            }
          }
        },
        {
          text: '回基层医疗机构执业，重新拿起听诊器',
          label: '均衡',
          target: 'ending_switch_grassroots_return',
          effects: { ethics: 8, health: 5, stress: -8, money: 4, network: -3 },
          career: { cityTier: 'county_rural', hospitalTier: 'county_basic', hospitalType: 'grassroots' },
          impactHint: '医德明显上升｜压力大幅下降｜平台层级下降',
          resultText: '社区卫生服务中心的主任看了你的简历，说"你这样的怎么会来我们这"。你说想踏实干活。半年后你成了那里挂号最多的医生，签约居民管你叫"大医院来的那个"。'
        },
        {
          text: '做自由职业/独立顾问，把经验直接卖出去',
          label: '激进',
          effects: { stress: 6, money: -4, network: 4 },
          impactHint: '判定：自由职业站稳｜失败则长期漂着｜收入不稳定',
          check: {
            baseChance: 46,
            stats: { network: 0.35, research: 0.2, skill: 0.2, stress: -0.2 },
            minChance: 18,
            maxChance: 82,
            success: {
              target: 'ending_switch_freelance',
              effects: { money: 14, health: 6, stress: -6, network: 8 },
              feedback: '第三个客户开始主动续约，你的日程表终于填满了。',
              log: '判定成功（再就业）：你把自己做成了一个可持续的品牌。',
              resultText: '你给自己印了名片，头衔那栏空了很久，最后写了"独立医学顾问"。第一年接了三个项目，第二年客户开始主动找上门。自由的意思是：你依然很忙，但至少是你自己排的班。'
            },
            failure: {
              target: 'ending_switch_gig_drift',
              effects: { stress: 12, money: -12, health: -5, network: -3 },
              feedback: '零散的活接了不少，但没有一个能撑起下一年。',
              log: '判定失败（再就业）：自由职业没能形成稳定收入。',
              resultText: '你接过讲课、写稿、审稿、陪诊、线上答疑，每一样都能做，每一样都不够。年底你算了下总收入，相当于原来的六成，而工作时间是原来的一点二倍。自由这个词，账单不认。'
            }
          }
        }
      ]
    },

    // ===== 副高 → 主任医师 → 科室负责人 =====
    {
      id: 'assoc_subspecialty_focus',
      stage: 'senior',
      major: true,
      title: '副高之后：你到底是做什么的',
      text: '拿到副高之后的第一个月，你被问了三次同样的问题："你主攻哪个方向？"\n以前你可以说"什么都看一点"，现在这个答案会让人皱眉。',
      yearDelta: 1,
      options: [
        {
          text: '锁定一个亚专科，用三年把病例做成体系',
          label: '长期主义',
          safeChoice: true,
          target: 'assoc_duty_portfolio',
          effects: { skill: 6, research: 4, stress: 5, health: -3, network: 3 },
          flagsSet: ['subspecialty_focused'],
          impactHint: '医术明显上升｜压力上升｜健康轻微下降',
          resultText: '你在门诊系统里申请开了一个专病号源，第一个月挂出去十一个。三年后同一个号源提前一周约满，你的病例数据库里有八百多条记录，每一条都是你自己录的。'
        },
        {
          text: '做交叉方向，把两个领域的病例串起来',
          label: '激进',
          target: 'assoc_duty_portfolio',
          effects: { research: 6, network: 5, skill: 4, stress: 7, health: -4 },
          flagsSet: ['crossover_track'],
          impactHint: '科研明显上升｜压力明显上升｜方向风险高',
          resultText: '你选了一条没什么人走的交叉线。评审专家听完你的规划说"很有意思"，这三个字在学术圈里的含义介于"我看好你"和"我看不懂"之间，你决定按前者理解。'
        },
        {
          text: '不急着定位，先把科室里没人愿意接的活接下来',
          label: '团队协作',
          target: 'assoc_duty_portfolio',
          effects: { network: 7, ethics: 5, skill: 3, stress: 6, health: -3 },
          flagsSet: ['dept_workhorse'],
          impactHint: '人脉明显上升｜医德上升｜压力上升',
          resultText: '你接下了会诊值班、教学秘书和三个没人管的质控指标。主任说"辛苦你了"，同事说"你太老实了"。两年后科室开会讨论谁最了解全科运转，所有人同时看向了你。'
        }
      ]
    },
    {
      id: 'assoc_duty_portfolio',
      stage: 'senior',
      title: '教学、科研、质控、排班：四个抽屉',
      text: '副高之后你会自动获得四个抽屉，每个抽屉里都塞满了"顺便帮忙看一下"。\n院里最近在推"高质量发展考核"，四个抽屉同时开始震动。',
      yearDelta: 1,
      options: [
        {
          text: '接教学与青年医师培养，做人才梯队',
          label: '长期主义',
          target: 'assoc_faction_alignment',
          effects: { network: 6, ethics: 6, skill: 4, stress: 4 },
          flagsSet: ['teaching_backbone'],
          impactHint: '人脉上升｜医德上升｜压力上升',
          resultText: '你带的第一批住院医里有两个后来留了下来。他们查房时的用词和你一模一样，包括你那句口头禅"先看病人，再看单子"。传承这件事最朴素的证据，就是别人开始说你的话。'
        },
        {
          text: '接医疗质量与安全管理，把规则做实',
          label: '稳妥',
          target: 'assoc_faction_alignment',
          effects: { legalRisk: -10, ethics: 6, network: 4, stress: 6, health: -2 },
          flagsSet: ['quality_manager'],
          impactHint: '法律风险明显下降｜压力上升｜容易得罪人',
          resultText: '你上任第一件事是把病历质控名单公示到科室群。当天群里安静了两小时，第二天返修率降了一半。有人私下说你不近人情，也有人在半年后的一次投诉里悄悄谢了你。'
        },
        {
          text: '接科研与课题申报，把成果做上去',
          label: '激进',
          target: 'assoc_faction_alignment',
          effects: { research: 8, network: 4, stress: 8, health: -5, money: -3 },
          flagsSet: ['research_backbone'],
          impactHint: '科研大幅上升｜健康下降｜压力明显上升',
          resultText: '你把本子写到第五版，最后一版是在孩子的家长会上用手机改的。中标那天你在科室群里发了个红包，二十个人抢，人均一块二。这大概是你这辈子性价比最低也最开心的一次发红包。'
        },
        {
          text: '接排班与运行协调，掌握科室的时间',
          label: '团队协作',
          target: 'assoc_faction_alignment',
          effects: { network: 9, stress: 7, ethics: -2, health: -3 },
          flagsSet: ['schedule_power'],
          impactHint: '人脉大幅上升｜压力明显上升｜医德轻微下降',
          resultText: '你现在掌握着全科最有权力的一张表。第一个月你就收到了七条"能不能帮我调一下"的私信，其中三条来自比你资深的人。排班表教会你的第一课是：所有人都很讲道理，直到轮到自己值除夕。'
        }
      ]
    },
    {
      id: 'assoc_faction_alignment',
      stage: 'senior',
      major: true,
      title: '科室里那条看不见的线',
      text: '老主任还有三年退休，两位副主任已经各自有了一圈人。\n没有人明说，但每次开会的座位、每个课题的署名、每次值班的调整，都在悄悄标记着谁是谁的人。',
      yearDelta: 1,
      options: [
        {
          text: '明确站队，靠近其中一位副主任',
          label: '激进',
          effects: { network: 8, stress: 4, ethics: -5 },
          flagsSet: ['faction_aligned'],
          impactHint: '人脉明显上升｜医德下降｜绑定风险（后果延迟）',
          delayed: [{ turns: 3, effects: { network: -6, stress: 8 }, log: '你站的那条线在人事调整中失势，你被顺带边缘化了一阵。' }],
          check: {
            baseChance: 58,
            stats: { network: 0.35, stress: -0.2, ethics: -0.1, skill: 0.15 },
            minChance: 28,
            maxChance: 86,
            success: {
              target: 'chief_title_qualification',
              effects: { network: 10, money: 5 },
              feedback: '你被拉进了那个"小范围讨论一下"的群。',
              log: '判定成功（站队）：你进入了核心圈层，资源开始向你倾斜。',
              resultText: '你被加进了一个只有六个人的群。群里聊的东西你以前从来不知道存在，比如某个名额其实早在三个月前就定了。知情的感觉很好，代价是你从此也成了别人眼里"那边的人"。'
            },
            failure: {
              target: 'chief_title_qualification',
              effects: { network: -6, stress: 10, ethics: -3 },
              feedback: '你靠得太明显，另一边也记住了你。',
              log: '判定失败（站队）：站队没换来资源，反而树了敌。',
              resultText: '你在一次会上替某位副主任说了句话，结果那句话被完整地转述给了另一位。第二周你的两个会诊班被调走了，理由是"工作量平衡"。科室里最快的传播路径不是电话，是走廊。'
            }
          }
        },
        {
          text: '保持中立，只对病例和数据负责',
          label: '稳妥',
          safeChoice: true,
          target: 'chief_title_qualification',
          effects: { ethics: 8, skill: 5, network: -3, stress: 3 },
          flagsSet: ['neutral_professional'],
          impactHint: '医德明显上升｜人脉轻微下降｜长期口碑积累',
          resultText: '你在两位副主任的邀约里都选择了"我不太懂这些"。有人说你装糊涂，有人说你聪明。三年后老主任退休时说了一句："这些年科里只有他一个人从来没跟我说过别人坏话。"'
        },
        {
          text: '两边都维持关系，谁的活都接',
          label: '均衡',
          target: 'chief_title_qualification',
          effects: { network: 6, stress: 8, health: -4, ethics: -2 },
          flagsSet: ['dual_alignment'],
          impactHint: '人脉上升｜压力明显上升｜健康下降',
          resultText: '你成了科里最忙的人，因为两边的活你都接。好处是谁都不讨厌你，坏处是谁也不真正把你当自己人。走钢丝的人看起来很稳，其实只是没人敢碰他。'
        },
        {
          text: '把精力投到院外：学会任职、多中心合作',
          label: '长期主义',
          target: 'chief_title_qualification',
          effects: { network: 7, research: 5, stress: 5, money: -4, health: -2 },
          flagsSet: ['external_reputation'],
          impactHint: '人脉上升｜科研上升｜院内存在感下降',
          resultText: '你在学会里拿到了一个青年委员的位子，去外地开会的次数比在科里开会还多。科室有人嘀咕"整天不在"，直到有一次全院引进设备，厂商说"我们认识你们那位老师"。'
        }
      ]
    },
    {
      id: 'chief_title_qualification',
      stage: 'senior',
      major: true,
      title: '主任医师资格：条件、配额与那篇文章',
      text: '正高的条件比副高长了一倍，其中三条是今年新加的。\n更麻烦的是：你名下有一篇文章，一助的位置上写着一个当年没怎么干活但现在很关键的名字。',
      yearDelta: 1,
      options: [
        {
          text: '按规矩来：材料真实，署名争议公开说清楚',
          label: '稳妥',
          safeChoice: true,
          effects: { ethics: 9, legalRisk: -8, stress: 7, network: -3, health: -2 },
          flagsSet: ['clean_promotion'],
          impactHint: '医德大幅上升｜法律风险下降｜短期得罪人',
          check: {
            baseChance: 80,
            stats: { ethics: 0.25, skill: 0.25, research: 0.2, stress: -0.2 },
            minChance: 40,
            maxChance: 90,
            success: {
              target: 'chief_title_review',
              effects: { ethics: 6, network: 4, skill: 5 },
              feedback: '你把话说开了，出乎意料的是对方也松了口。',
              log: '判定成功（正高资格）：材料真实过关，署名问题被摆平。',
              resultText: '你约那位老师喝了杯茶，把当年的邮件记录带上了。对方看了两分钟，说"那就按实际情况改吧"。你准备了一晚上的说辞一句没用上——有时候人怕的不是被拒绝，是开口。'
            },
            failure: {
              target: 'chief_title_setback',
              effects: { stress: 12, network: -6, health: -4 },
              feedback: '你说清楚了，但对方不接受，材料被压了下来。',
              log: '判定失败（正高资格）：署名争议没能解决，申报受阻。',
              resultText: '对方听完只说了句"当年不是这么说的"。你翻出邮件，对方说"邮件不能说明什么"。材料最后没能提交，理由栏里写着"待核实"，三个字，一年时间。'
            }
          }
        },
        {
          text: '走捷径：按对方要求调整署名，先把资格拿到手',
          label: '激进',
          effects: { network: 8, research: 4, ethics: -10, legalRisk: 9, stress: 4 },
          flagsSet: ['authorship_compromise'],
          impactHint: '人脉上升｜医德大幅下降｜法律风险明显上升｜后果延迟',
          delayed: [{ turns: 3, effects: { legalRisk: 8, ethics: -4, stress: 10 }, log: '当年那篇文章被人翻了出来，署名问题变成了一次正式调查。' }],
          target: 'chief_title_review',
          resultText: '你在署名修改说明上签了字，笔迹很工整。资格顺利通过，你在庆祝的饭局上喝了不少。回家路上你想起当年熬夜跑数据的那个自己，觉得应该跟他道个歉，但不知道从哪说起。'
        },
        {
          text: '补短板：先花两年把临床与教学硬指标做扎实',
          label: '长期主义',
          target: 'chief_title_review',
          effects: { skill: 7, ethics: 5, research: 3, stress: 6, health: -3, money: -3 },
          yearDelta: 2,
          flagsSet: ['solid_credentials'],
          impactHint: '医术明显上升｜时间成本高｜医德上升',
          resultText: '你主动推迟了一轮，用两年补齐了带教工作量和疑难病例数。有人说你傻，错过了名额宽松的那一年。但你提交材料时，每一项后面都能附上原始记录——这种踏实感，比早两年拿到更让你睡得着。'
        }
      ]
    },
    {
      id: 'chief_title_review',
      stage: 'senior',
      major: true,
      title: '评审年：名额、新规与一封通知',
      text: '答辩前两周，人事处发来通知：本年度正高名额因"结构优化"暂缓一半，同时新增一项"近三年主持院级以上项目"的要求。\n通知的落款时间是周五下午五点四十七分。',
      yearDelta: 1,
      options: [
        {
          text: '按新规硬补，能补多少补多少',
          label: '激进',
          effects: { research: 6, stress: 11, health: -6, money: -4 },
          impactHint: '科研上升｜压力大幅上升｜健康明显下降',
          check: {
            baseChance: 50,
            stats: { research: 0.3, skill: 0.2, network: 0.2, stress: -0.3 },
            minChance: 20,
            maxChance: 84,
            success: {
              target: 'chief_title_outcome',
              effects: { research: 8, network: 6, money: 8 },
              career: { careerTitle: 'chief' },
              flagsSet: ['chief_title_holder'],
              feedback: '你在两周里补出了别人两年的材料，评审组没再多问。',
              log: '判定成功（正高评审）：你踩着新规的边缘通过了。',
              resultText: '你在两周内完成了一个院级项目的立项、一份结题报告和三份支撑材料。评审那天你讲了十二分钟，专家只问了一个问题。走出会议室时你扶了一下墙，不是紧张，是低血糖。'
            },
            failure: {
              target: 'chief_title_setback',
              effects: { stress: 14, health: -6, research: 3 },
              feedback: '新规是为某些人量身定做的，而你不在名单上。',
              log: '判定失败（正高评审）：新增条件卡住了你。',
              resultText: '公示名单出来那天，通过的三个人里有两个的项目立项时间是去年十二月——刚好在新规适用期的第一天。你没有去问，因为你已经知道答案了。'
            }
          }
        },
        {
          text: '联合同批候选人，向人事处提出过渡期诉求',
          label: '团队协作',
          effects: { network: 7, ethics: 6, stress: 6 },
          impactHint: '判定：争取到过渡条款｜人脉上升｜可能得罪管理层',
          check: {
            baseChance: 56,
            stats: { network: 0.35, ethics: 0.25, stress: -0.2, skill: 0.1 },
            minChance: 26,
            maxChance: 86,
            success: {
              target: 'chief_title_outcome',
              effects: { network: 12, ethics: 8, money: 6 },
              career: { careerTitle: 'chief' },
              flagsSet: ['chief_title_holder', 'collective_advocacy'],
              feedback: '八个人一起署名的那封信，最后换来了一年过渡期。',
              log: '判定成功（正高评审）：集体诉求争取到了过渡条款。',
              resultText: '你们八个人写了一封措辞极其克制的信，逐字推敲了三个晚上。回复只有一行字："经研究，本年度按原标准执行。"这一行字背后，是八个人的下一年。'
            },
            failure: {
              target: 'chief_title_setback',
              effects: { stress: 10, network: 4, ethics: 5 },
              feedback: '信递上去了，回复是"已收悉"。',
              log: '判定失败（正高评审）：诉求没有改变结果。',
              resultText: '"已收悉"这三个字挂在系统里，状态一直是"处理中"，直到评审结束后自动变成"已办结"。你截了个图，存在一个叫"留个纪念"的文件夹里。'
            }
          }
        },
        {
          text: '找关系疏通，确保自己在保留的那一半名额里',
          label: '均衡',
          effects: { network: 6, money: -12, ethics: -8, legalRisk: 8, stress: 5 },
          flagsSet: ['promotion_lobbying'],
          impactHint: '医德明显下降｜法律风险上升｜经济成本高｜后果延迟',
          delayed: [{ turns: 4, effects: { legalRisk: 6, stress: 8, ethics: -3 }, log: '当年疏通的事被人在一次谈话里提起，你的名字进入了某份清单。' }],
          target: 'chief_title_outcome',
          career: { careerTitle: 'chief' },
          resultText: '事情办成了，过程你不太愿意回忆。拿到聘书那天你请了客，席间有人说"该你的"。你笑着举杯，心里清楚这三个字里有多少是"该"，有多少是"办"。'
        },
        {
          text: '主动退出本轮，把重心转回临床与团队',
          label: '稳妥',
          safeChoice: true,
          target: 'chief_title_setback',
          effects: { health: 7, stress: -10, ethics: 7, skill: 5 },
          impactHint: '健康明显上升｜压力大幅下降｜职称推迟',
          resultText: '你在申报系统里点了"撤回"。那天下午你按时下班，回家做了顿饭。晚上有同事发消息问"你真不评了？"，你回："今年不评。"两个字的差别，只有自己知道。'
        }
      ]
    },
    {
      id: 'chief_title_setback',
      stage: 'senior',
      title: '没评上的那一年，日子照过',
      text: '公示栏上没有你。第二天你还是要查房，还是要写病历，还是要在家属面前保持稳定。\n只是晚上关灯之后，你会想一想这条路还要不要走下去。',
      yearDelta: 1,
      options: [
        {
          text: '再战一轮，把缺的那块补上',
          label: '长期主义',
          target: 'chief_title_review',
          effects: { research: 6, skill: 5, stress: 7, health: -4 },
          impactHint: '科研上升｜压力上升｜再次进入评审',
          resultText: '你把评审反馈的每一条都抄在了一张纸上，贴在办公桌前。同事说这样太惨了，你说这叫需求文档。第二年再交材料时，那张纸上的字已经被摸得有点糊了。'
        },
        {
          text: '不追职称了，去竞聘科室负责人岗位',
          label: '激进',
          target: 'dept_head_competition',
          effects: { network: 8, stress: 6, ethics: -2 },
          impactHint: '人脉上升｜转向管理岗｜压力上升',
          resultText: '你想通了一件事：职称是评出来的，岗位是竞出来的，两者的规则完全不同。你把材料从"我发了几篇文章"改成了"我能让这个科室多接多少病人"，写完自己都觉得换了一个人。'
        },
        {
          text: '接受停在副高，做一个安稳的临床专家',
          label: '稳妥',
          safeChoice: true,
          target: 'ending_senior_expert_rest',
          effects: { health: 10, stress: -12, ethics: 8, skill: 6 },
          impactHint: '健康大幅上升｜压力大幅下降｜职业天花板确定',
          resultText: '你在一次科室会议上主动说"以后有名额先给年轻人"。会后有人说你想开了，有人说你放弃了。你自己知道，你只是终于把"我值不值得"这个问题，从别人的评审表上收了回来。'
        },
        {
          text: '换个平台，去更需要你的地方重新开始',
          label: '均衡',
          target: 'career_mobility_county_chief',
          effects: { network: 5, money: 6, ethics: 5, stress: -5, health: 4 },
          career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2' },
          impactHint: '压力下降｜收入上升｜平台层级下降',
          resultText: '你接到地市医院的电话时正在写病历。对方说"我们这边正高名额还有"，你笑了。同样的资历，在这里是"再等等"，在那里是"快来"。这不是能力问题，是坐标问题。'
        }
      ]
    },
    {
      id: 'chief_title_outcome',
      stage: 'senior',
      major: true,
      title: '拿到主任医师之后',
      text: '聘书是一张纸，装在一个红色的本子里。\n发下来的当天，你的排班没有变，门诊量没有变，唯一变了的是别人叫你的方式。',
      yearDelta: 1,
      options: [
        {
          text: '竞聘科室负责人，从看病走向带队',
          label: '激进',
          target: 'dept_head_competition',
          effects: { network: 8, stress: 7, money: 4, health: -3 },
          impactHint: '人脉上升｜压力明显上升｜进入管理线',
          resultText: '你去人事处领了竞聘表。填到"管理经验"那一栏时你写了排班、质控和带教，写完发现自己这些年其实一直在做管理，只是没有名分也没有加班费。'
        },
        {
          text: '做纯粹的临床专家，把疑难病例做到极致',
          label: '长期主义',
          safeChoice: true,
          target: 'ending_chief_physician_expert',
          effects: { skill: 12, ethics: 8, health: 4, stress: -6, network: 4 },
          impactHint: '医术大幅上升｜压力下降｜不进入管理线',
          resultText: '你婉拒了竞聘邀请，理由是"我更想把时间花在病人身上"。这个理由在会议室里听起来很高尚，在你自己听来只是实话。此后十年，全院最难的会诊单最后都会停在你这里。'
        },
        {
          text: '转到院级平台：教学、科研或医务管理岗',
          label: '团队协作',
          target: 'dept_head_coordination',
          effects: { network: 10, research: 5, stress: 5, skill: -2 },
          flagsSet: ['hospital_platform'],
          impactHint: '人脉大幅上升｜医术轻微下降｜转向平台岗',
          resultText: '你搬到了行政楼三层，办公室有窗户，还有一盆需要浇水的绿植。第一周你最不适应的是安静——没有监护仪，没有呼叫铃，只有打印机偶尔响一下。'
        }
      ]
    },
    {
      id: 'dept_head_competition',
      stage: 'senior',
      major: true,
      title: '科室负责人竞聘：一场讲给谁听的答辩',
      text: '竞聘公告上写着"公开、公平、择优"。走廊里流传的版本是"其实已经定了"。\n两个说法都可能是对的——真正的问题是，你的方案有没有让"已经定了"变得不划算。',
      yearDelta: 1,
      options: [
        {
          text: '拿出三年学科规划，用数据和方案说话',
          label: '长期主义',
          effects: { network: 6, research: 4, skill: 4, stress: 8, health: -3 },
          impactHint: '判定：靠专业方案胜出｜压力明显上升',
          check: {
            baseChance: 54,
            stats: { skill: 0.2, research: 0.2, network: 0.25, ethics: 0.15, stress: -0.2 },
            minChance: 24,
            maxChance: 86,
            success: {
              target: 'dept_head_coordination',
              effects: { network: 12, money: 8, ethics: 5 },
              career: { careerTitle: 'dept_head' },
              flagsSet: ['dept_head_transparent'],
              feedback: '你的方案太具体了，具体到没法用"再研究研究"糊过去。',
              log: '判定成功（竞聘）：专业方案让你拿下了负责人岗位。',
              resultText: '你的 PPT 有三十七页，其中十九页是数据。讲到第二十二页时，院长打断你问了一个很细的问题，你当场答了出来。散会后有位评委说："这个准备程度，不给他不好交代。"'
            },
            failure: {
              target: 'dept_head_external_recruit',
              effects: { stress: 11, network: 5, research: 3 },
              feedback: '方案很好，但院里在同时谈一个外部人选。',
              log: '判定失败（竞聘）：内部竞聘被外部引进打断。',
              resultText: '结果公布前一周，院里来了位客人参观科室，被介绍为"来交流的专家"。你当时没多想。公示出来那天，你在名单上看到了那位"来交流的专家"的名字。'
            }
          }
        },
        {
          text: '先把关键票拉稳，再谈方案',
          label: '激进',
          effects: { network: 9, ethics: -7, money: -8, stress: 6 },
          flagsSet: ['dept_head_lobbying'],
          impactHint: '人脉大幅上升｜医德明显下降｜经济成本｜后果延迟',
          delayed: [{ turns: 3, effects: { ethics: -3, stress: 9, network: -5 }, log: '当年拉票的细节被翻出来，你在科室里的威信打了折扣。' }],
          check: {
            baseChance: 62,
            stats: { network: 0.4, money: 0.1, stress: -0.2, ethics: -0.1 },
            minChance: 30,
            maxChance: 88,
            success: {
              target: 'dept_head_coordination',
              effects: { network: 10, money: 6 },
              career: { careerTitle: 'dept_head' },
              flagsSet: ['dept_head_dark'],
              feedback: '票数出来那一刻，你知道方案其实没那么重要。',
              log: '判定成功（竞聘）：你靠关系网拿到了岗位。',
              resultText: '答辩你只讲了十分钟，因为该谈的都在之前谈完了。宣布结果时你在鼓掌的人群里看到几张笑得很到位的脸，你也笑了，笑得同样到位。'
            },
            failure: {
              target: 'dept_head_external_recruit',
              effects: { stress: 13, ethics: -5, network: -6, money: -6 },
              feedback: '你把宝押在了几个人身上，而他们临时改了主意。',
              log: '判定失败（竞聘）：关系没兜住，你还赔了人情和钱。',
              resultText: '有两位关键人物在最后一刻"因故请假"。你事后才知道，他们那天下午一起去了另一个饭局。人情这东西的问题在于，它同时欠着好几个人。'
            }
          }
        },
        {
          text: '联合科里骨干一起提方案，谁上都推这套规划',
          label: '团队协作',
          effects: { network: 8, ethics: 8, stress: 5, skill: 3 },
          impactHint: '判定：团队支持胜出｜医德明显上升｜结果不由你独占',
          check: {
            baseChance: 60,
            stats: { network: 0.3, ethics: 0.3, skill: 0.15, stress: -0.2 },
            minChance: 30,
            maxChance: 88,
            success: {
              target: 'dept_head_coordination',
              effects: { network: 12, ethics: 10, money: 5 },
              career: { careerTitle: 'dept_head' },
              flagsSet: ['dept_head_transparent', 'team_mandate'],
              feedback: '五个人签名的方案递上去，院里很难忽略。',
              log: '判定成功（竞聘）：团队共识把你推了上去。',
              resultText: '你们五个人一起做了这份方案，署名按姓氏笔画排。宣布结果那天，另外四个人比你还激动。你上任后做的第一件事，是把那四个人的名字写进了科室工作分工表。'
            },
            failure: {
              target: 'dept_head_external_recruit',
              effects: { stress: 9, network: 8, ethics: 6 },
              feedback: '方案被采纳了，负责人却另有其人。',
              log: '判定失败（竞聘）：方案上了，人没上。',
              resultText: '新负责人上任后第一次科会，PPT 用的是你们那份方案，连页脚都没改。他说"这是院里的统一部署"。你和另外四个人对视了一眼，谁也没说话。'
            }
          }
        },
        {
          text: '退出竞聘，把位置让给更合适的人',
          label: '稳妥',
          safeChoice: true,
          target: 'ending_leave_management_line',
          effects: { health: 9, stress: -12, ethics: 9, skill: 6, network: -3 },
          impactHint: '健康明显上升｜压力大幅下降｜退出管理线',
          resultText: '你在竞聘会前一天撤了材料，理由写的是"个人原因"。真实原因是你算了一笔账：当科主任每周要开十一个会，而你每周有十一台手术。你选了后者，并且再也没有后悔过。'
        }
      ]
    },
    {
      id: 'dept_head_coordination',
      stage: 'senior',
      major: true,
      title: '当上负责人的第一年：会议、指标与人',
      text: '你以为负责人的工作是决定科室方向，实际上前六个月你在做三件事：开会、填表、劝人别辞职。\n院里给了你三个指标：出院人次、平均住院日、次均费用。这三个指标互相矛盾，但都要完成。',
      yearDelta: 2,
      options: [
        {
          text: '守住医疗质量，指标能完成多少算多少',
          label: '稳妥',
          safeChoice: true,
          target: 'dept_head_outcome',
          effects: { ethics: 10, legalRisk: -8, skill: 5, network: -4, stress: 7, money: -4 },
          flagsSet: ['quality_first_lead'],
          impactHint: '医德大幅上升｜法律风险下降｜考核排名下降',
          resultText: '季度考核你们科排在全院倒数第四，院长找你谈话。你带了一份数据：同期你们科的非计划再入院率是全院最低。院长看了很久，说"这个我知道，但排名是排名"。'
        },
        {
          text: '按指标优化流程，把该压的都压下去',
          label: '激进',
          target: 'dept_head_outcome',
          effects: { money: 10, network: 8, ethics: -8, legalRisk: 7, stress: 8, health: -4 },
          flagsSet: ['metric_driven_lead'],
          impactHint: '收入上升｜医德明显下降｜法律风险上升｜后果延迟',
          delayed: [{ turns: 3, effects: { legalRisk: 6, ethics: -4, stress: 8 }, log: '压缩住院日带来的隐患终于变成了一次医疗纠纷和一次专项检查。' }],
          resultText: '你把平均住院日压到了全院第二。做法是把康复期的病人尽早转出去，转到哪里不在你的考核范围内。数据很漂亮，你在庆功会上讲话时看了一眼台下年轻医生的表情，没敢多看。'
        },
        {
          text: '把矛盾摆到院里去谈，争取资源和口径',
          label: '团队协作',
          effects: { network: 7, ethics: 6, stress: 8, health: -3 },
          impactHint: '判定：争取到资源与口径调整｜可能被认为不服管理',
          check: {
            baseChance: 55,
            stats: { network: 0.35, ethics: 0.25, skill: 0.15, stress: -0.2 },
            minChance: 26,
            maxChance: 86,
            success: {
              target: 'dept_head_outcome',
              effects: { network: 12, money: 8, ethics: 6, stress: -5 },
              flagsSet: ['resource_negotiator'],
              feedback: '你把三个矛盾的指标摆在一页纸上，院里终于给了口径。',
              log: '判定成功（协调）：你为科室争取到了资源与考核调整。',
              resultText: '你做了一张只有一页的表，左边是院里的三个指标，右边是它们互相打架的地方。院长看完沉默了一会儿，说"你这个图做得挺清楚"。三周后考核口径调整了，你们科多了两个编制。'
            },
            failure: {
              target: 'dept_head_outcome',
              effects: { stress: 12, network: -6, ethics: 5, health: -4 },
              feedback: '你说得都对，但"提要求"这件事本身就被记住了。',
              log: '判定失败（协调）：诉求没被接受，你被贴上了"不好带"的标签。',
              resultText: '会上你讲了八分钟，讲完之后是很长的安静。散会时有位老主任拍拍你肩膀说："年轻人，有些话心里知道就行。"你点点头，回科里把那页纸收进了抽屉。'
            }
          }
        },
        {
          text: '把管理事务分权给团队，自己守住临床',
          label: '长期主义',
          target: 'dept_head_outcome',
          effects: { network: 6, skill: 8, ethics: 6, health: 5, stress: -6, money: -3 },
          flagsSet: ['delegating_lead'],
          impactHint: '医术明显上升｜健康上升｜管理掌控力下降',
          resultText: '你把质控、排班、教学分给了三个人，自己只保留最终拍板权。有人说你"当甩手掌柜"，两年后那三个人有两个评上了副高。你觉得这个评价可以接受。'
        }
      ]
    },
    {
      id: 'dept_head_external_recruit',
      stage: 'senior',
      major: true,
      title: '外面来的那个人',
      text: '院里从外单位引进了一位学科带头人，直接空降科室负责人。\n欢迎会上他说"我来是为了和大家一起把学科做起来"，台下所有人都在鼓掌，包括你。',
      yearDelta: 1,
      options: [
        {
          text: '主动配合，做他最信任的执行者',
          label: '团队协作',
          safeChoice: true,
          target: 'dept_head_outcome',
          effects: { network: 9, skill: 5, stress: 5, ethics: 3 },
          flagsSet: ['second_in_command'],
          impactHint: '人脉明显上升｜压力上升｜位置从一号变二号',
          resultText: '你成了新主任最依赖的人，因为整个科室只有你能说清楚每台设备的采购年份和每个人的排班偏好。三年后他调走时，向院里推荐了你。有些位置是站出来的，有些是熬出来的。'
        },
        {
          text: '保持距离，把自己的亚专科做成独立品牌',
          label: '长期主义',
          target: 'dept_head_outcome',
          effects: { skill: 9, research: 6, network: -4, stress: 6, health: -3 },
          flagsSet: ['independent_brand'],
          impactHint: '医术明显上升｜科研上升｜人脉下降',
          resultText: '你不参与科室的权力重组，只管把自己的专病门诊做大。两年后你的门诊量占了科室的三分之一，新主任在一次会上说"这块我们要尊重专业意见"。实力是最不需要解释的立场。'
        },
        {
          text: '接受院里给的另一个平台岗位',
          label: '均衡',
          target: 'ending_platform_transfer',
          effects: { network: 10, money: 6, stress: -4, skill: -3, health: 4 },
          flagsSet: ['hospital_platform'],
          impactHint: '人脉大幅上升｜医术下降｜离开科室一线',
          resultText: '院里给了你一个新岗位，级别不低，事情不少，就是离病人远了一点。你搬办公室那天，把听诊器留在了原来的抽屉里，然后又拿了回来——放在新办公室的抽屉里。'
        },
        {
          text: '去地市/县域医院，直接当负责人',
          label: '激进',
          target: 'career_mobility_county_chief',
          effects: { network: 6, money: 8, ethics: 6, stress: -3, health: 3 },
          career: { cityTier: 'prefecture', hospitalTier: 'prefecture_tier3_strong2', careerTitle: 'dept_head' },
          impactHint: '收入上升｜医德上升｜平台层级下降｜获得实权',
          resultText: '你带着一份三年规划去了地市医院面试，对方院长听完只问了一句"你什么时候能来"。在这里你不用等三年，因为这里等你已经等了三年。'
        }
      ]
    },
    {
      id: 'dept_head_outcome',
      stage: 'senior',
      major: true,
      title: '五年之后，回头看这个科室',
      text: '新来的规培生已经不知道五年前科室是什么样子了。\n有些东西是你留下的，有些东西是你没能拦住的。现在该决定，接下来怎么收尾。',
      yearDelta: 2,
      options: [
        {
          text: '继续带队，把学科做成区域标杆',
          label: '激进',
          target: 'ending_dept_head_builder',
          effects: { network: 12, research: 8, money: 10, stress: 8, health: -5 },
          conditions: { anyFlags: ['dept_head_transparent', 'team_mandate', 'resource_negotiator', 'quality_first_lead'] },
          impactHint: '人脉大幅上升｜压力明显上升｜健康下降',
          resultText: '五年后你们科成了区域会诊中心，每周有外院医生来进修。你在开班仪式上讲话，讲到一半忽然想起自己当年第一次来这个科室报到时，在门口站了三分钟不敢进去。'
        },
        {
          text: '交棒给年轻人，自己退回临床与教学',
          label: '长期主义',
          target: 'ending_dept_head_handover',
          effects: { ethics: 12, skill: 8, health: 8, stress: -12, network: -3 },
          impactHint: '医德大幅上升｜健康明显上升｜交出管理权',
          resultText: '你在四十九岁那年主动提出卸任，推荐了一位三十八岁的副主任。院里问你为什么，你说"我该做的做完了"。交接那天你只用了半小时，因为该交的东西早就都在制度里了。'
        },
        {
          text: '离开管理线，回到纯粹的专家角色',
          label: '稳妥',
          safeChoice: true,
          target: 'ending_leave_management_line',
          effects: { health: 10, stress: -14, skill: 10, ethics: 8, money: -5 },
          impactHint: '健康大幅上升｜压力大幅下降｜收入下降',
          resultText: '你把负责人的钥匙还了回去，只留下门诊和手术。第一个不用开会的周三下午，你在办公室里坐了很久，然后想起来自己其实可以直接回家。'
        },
        {
          text: '面对遗留问题，承担应该承担的责任',
          label: '均衡',
          target: 'ending_dept_head_reckoning',
          effects: { ethics: 10, legalRisk: -6, stress: 10, network: -6, money: -8 },
          conditions: { anyFlags: ['metric_driven_lead', 'dept_head_dark', 'dept_head_lobbying', 'promotion_lobbying', 'authorship_compromise'] },
          impactHint: '医德大幅上升｜法律风险下降｜人脉与收入下降',
          resultText: '专项检查来的时候，你没有推给任何人。谈话记录里有一句"相关决策由本人作出"，你签字时手很稳。处理结果下来后你被免去了负责人职务，但保留了执业资格。有人说你傻，你说总得有人签这个字。'
        }
      ]
    },

    // ===== 新增结局 =====
    { id: 'ending_switch_industry_lead', stage: 'ending', type: 'ending', title: '结局：产业里的医学负责人', text: '你从写病历的人变成了写策略的人。会议室里你依然是唯一会问"这对患者意味着什么"的那个，而这个问题让你被需要。' },
    { id: 'ending_switch_ops_stable', stage: 'ending', type: 'ending', title: '结局：稳定长跑的临床运营', text: '不追风口，不冲职级，你把一条线跑成了长跑。周末是真的周末，体检报告上没有箭头——这在你原来那个行业里，是一种奢侈。' },
    { id: 'ending_switch_content_editor', stage: 'ending', type: 'ending', title: '结局：把专业翻译成人话的人', text: '你一年写的东西被几百万人读过。你救不了具体的某个人，但你让很多人少走了一段弯路。这笔账不好算，但你算得下去。' },
    { id: 'ending_switch_return_clinic', stage: 'ending', type: 'ending', title: '结局：绕了一圈又回到病床边', text: '你带着产业世界的方法论回到了临床。同事说你变了，你说我只是学会了在做一件事之前先问"这能不能被复制"。' },
    { id: 'ending_switch_reemployed', stage: 'ending', type: 'ending', title: '结局：第九次面试之后', text: '你重新有了工牌、工位和固定的收入。薪水比从前低，安全感比从前贵。你把那段空窗期存在了心里，作为一种随时可以取用的清醒。' },
    { id: 'ending_switch_grassroots_return', stage: 'ending', type: 'ending', title: '结局：回到基层的听诊器', text: '兜了一大圈，你最后回到了最基础的那种工作：认识每一个病人，记得每一个人的药。这里没有职称竞争，也没有名额冻结，只有具体的人。' },
    { id: 'ending_switch_freelance', stage: 'ending', type: 'ending', title: '结局：独立医学顾问', text: '你把自己做成了一个可持续的小机构。依然很忙，但排班表是自己写的。自由不是不工作，是你终于能决定为谁工作。' },
    { id: 'ending_switch_probation_out', stage: 'ending', type: 'ending', title: '结局：试用期未通过', text: '你用力过猛，撞上了一堵看不见的墙。离开时你才知道，新赛道也有它的等级、边界和不成文的规矩，而且它们比医院的更隐蔽。' },
    { id: 'ending_switch_long_unemployed', stage: 'ending', type: 'ending', title: '结局：长期空窗', text: '简历改到第十一版，你把最引以为傲的十年压缩成了三行字。工作日的上午十点依然安静、有阳光，你已经不再觉得那是松弛。' },
    { id: 'ending_switch_gig_drift', stage: 'ending', type: 'ending', title: '结局：什么都接，什么都不够', text: '讲课、写稿、审稿、陪诊、线上答疑，你什么都能做。年底一算，工作时间更长了，收入更薄了。自由职业最难的部分不是接活，是拒绝。' },
    { id: 'ending_chief_physician_expert', stage: 'ending', type: 'ending', title: '结局：主任医师，不当主任', text: '你拿到了正高，却主动放弃了管理岗。全院最难的会诊单最终都会停在你这里，你的名字后面没有职务，只有一串病例。' },
    { id: 'ending_dept_head_builder', stage: 'ending', type: 'ending', title: '结局：把科室带成标杆', text: '五年时间，你把一个普通科室做成了区域会诊中心。代价是你的体检报告和你孩子的家长会出勤率。你说值得，说的时候声音有点哑。' },
    { id: 'ending_dept_head_handover', stage: 'ending', type: 'ending', title: '结局：主动交棒的负责人', text: '你在最好的时候把位置让了出去。真正的制度建设不是你在的时候一切正常，而是你走了之后一切照常。' },
    { id: 'ending_dept_head_reckoning', stage: 'ending', type: 'ending', title: '结局：签下那个字的人', text: '当年为了指标压下去的那些东西，最后都回来了。你没有推给任何人，在谈话记录上签了自己的名字。职务没了，脊梁还在。' },
    { id: 'ending_platform_transfer', stage: 'ending', type: 'ending', title: '结局：转到院级平台', text: '你离开了科室一线，去了一个能影响更多科室的地方。听诊器还在抽屉里，只是很久没拿出来了。你偶尔会想念被病人叫住的那种感觉。' },
    { id: 'ending_leave_management_line', stage: 'ending', type: 'ending', title: '结局：退出管理线的专家', text: '你把钥匙还了回去，只留下门诊和手术。有人觉得你不够有野心，你觉得自己终于把时间买了回来。这笔交易，你签得很痛快。' },
    { id: 'ending_senior_expert_rest', stage: 'ending', type: 'ending', title: '结局：停在副高，也挺好', text: '你不再追那张纸。查房、门诊、带学生，日子稳稳地过。评审表上没有你的名字，但科室每次遇到难办的病人，第一个想到的还是你。' }
  );

  // 把副高评审的成功出口接入新的晋升链
  {
    const chiefCompetition = findEvent('chief_competition');
    for (const option of chiefCompetition?.options || []) {
      if (option.check?.success?.target === 'senior_outcome') {
        option.check.success.target = 'assoc_subspecialty_focus';
      }
    }
    // 主任医师职称只能通过新的评审链取得，副高评审只给副高
    setCareerOnBranch('chief_competition', 1, 'success', { careerTitle: 'associate_chief' });

    const altCareer = findEvent('alt_career_track');
    if (altCareer) {
      altCareer.options = [
        {
          text: '系统看看所有转轨方向再做决定',
          label: '长期主义',
          target: 'career_switch_gateway',
          effects: { network: 5, stress: -3, health: 3 },
          impactHint: '打开完整转轨路径',
          resultText: '你把猎头、老同学和招聘公告的信息整理成了一张表，第一次认真比较了每条路的收入、风险和退出成本。做完这张表你发现，最难的不是选，是承认自己真的想走。'
        },
        { text: '直接进入药械企业医学事务岗', label: '均衡', target: 'career_switch_probation', effects: { money: 12, stress: -4, health: 6, ethics: -3 }, flagsSet: ['switch_industry_ma'], career: { hospitalType: 'industry' }, impactHint: '收入明显上升｜进入试用期', resultText: '你在两周内办完了离职手续，最后一天科里给你订了个蛋糕。走出住院部大楼时你回头看了一眼那扇永远关不严的自动门，觉得它这些年确实尽力了。' },
        { text: '加入互联网医疗平台', label: '激进', target: 'career_switch_probation', effects: { money: 10, network: 8, stress: 5, ethics: -2 }, flagsSet: ['switch_internet'], career: { hospitalType: 'industry' }, impactHint: '收入上升｜压力上升｜进入试用期', resultText: '入职第一天你领到了一台性能极好的笔记本电脑，比你在医院用了六年的那台工作站强十倍。你花了整整一分钟消化这个事实，然后开始学习什么叫"用户旅程"。' },
        { text: '考公进入卫生健康管理部门', label: '长期主义', target: 'career_switch_public_pick', effects: { network: 8, stress: -3, money: 4, ethics: 5 }, impactHint: '压力下降｜进入公共部门路径', resultText: '你买了一套行测和申论，摆在书架上原来放指南和教材的位置。翻开第一页时你笑了——三十几岁重新做选择题，题目却比当年简单得多，难的是那个竞争比。' },
        { text: '自己开一家规范的门诊部', label: '稳妥', target: 'private_track', effects: { money: -18, stress: 8, skill: 6, network: 6 }, impactHint: '经济成本高｜压力上升｜自主性上升', resultText: '你把工作十几年的积蓄拿出来交了半年房租。装修那天你站在空荡荡的诊室中间，第一次意识到以后没有人给你排班了——也没有人给你发工资了。' }
      ];
    }

    // 晋升受挫也能通向完整的转轨链条
    const promotionSetback = findEvent('promotion_setback');
    for (const option of promotionSetback?.options || []) {
      if (option.target === 'alt_career_track') option.target = 'career_switch_gateway';
    }
  }



  // ===== 科室体验章节标记：把已有的住院阶段专属事件并入章节池 =====
  for (const specialtyId of Object.keys(specialtyProfiles)) {
    for (const suffix of ['frontline', 'craft']) {
      const target = randomEvents.find((event) => event.id === `re_sp_${specialtyId}_${suffix}`);
      if (target && target.stage === 'resident') {
        target.specialtyChapter = specialtyId;
        target.chapterTheme = target.chapterTheme || (suffix === 'frontline' ? 'clinical' : 'team');
      }
    }
  }

  // ===== 统一遍历器（带下标，便于生成稳定文案） =====
  function walkIndexedContainers(visitor) {
    const visitList = (list, scope) => {
      for (const event of list) {
        for (const [index, option] of (event.options || []).entries()) {
          visitor(option, event, scope, 'option', index);
          if (option.check) {
            if (option.check.success) visitor(option.check.success, event, scope, 'success', index);
            if (option.check.failure) visitor(option.check.failure, event, scope, 'failure', index);
          }
        }
      }
    };
    visitList(events, 'main');
    visitList(randomEvents, 'random');
  }

  // ===== 成长再平衡：医术/科研/人脉的基础收益整体降速 =====
  const GROWTH_KEYS = ['skill', 'research', 'network'];

  function rescaleGrowthValue(value) {
    if (typeof value !== 'number' || value <= 0) return value;
    if (value <= 3) return value;
    if (value <= 8) return Math.min(6, Math.max(3, Math.round(value * 0.6)));
    return Math.min(10, Math.max(7, Math.round(value * 0.55)));
  }

  function rescaleGrowthEffects(effects) {
    if (!effects || typeof effects !== 'object') return;
    for (const key of GROWTH_KEYS) {
      if (typeof effects[key] === 'number' && effects[key] > 0) {
        effects[key] = rescaleGrowthValue(effects[key]);
      }
    }
  }

  walkIndexedContainers((container) => {
    rescaleGrowthEffects(container.effects);
    for (const delayed of container.delayed || []) {
      rescaleGrowthEffects(delayed.effects);
    }
  });

  // ===== 高收益必有代价：收益越大，代价越硬 =====
  function totalGrowthGain(effects) {
    if (!effects) return 0;
    return GROWTH_KEYS.reduce((sum, key) => sum + Math.max(0, effects[key] || 0), 0);
  }

  function countCosts(container, option) {
    const effects = container.effects || {};
    let costs = 0;
    if ((effects.health || 0) < 0) costs += 1;
    if ((effects.stress || 0) > 0) costs += 1;
    if ((effects.money || 0) < 0) costs += 1;
    if (typeof option?.yearDelta === 'number' && option.yearDelta > 0) costs += 1;
    if ((effects.ethics || 0) < 0 || (effects.legalRisk || 0) > 0) costs += 1;
    return costs;
  }

  function injectCost(container, slot) {
    container.effects = container.effects || {};
    const effects = container.effects;
    if (slot % 3 === 0) {
      effects.stress = (effects.stress || 0) > 0 ? effects.stress + 3 : 3;
      return;
    }
    if (slot % 3 === 1) {
      effects.health = (effects.health || 0) < 0 ? effects.health - 3 : -3;
      return;
    }
    effects.money = (effects.money || 0) < 0 ? Math.max(-25, effects.money - 2) : -3;
  }

  walkIndexedContainers((container, event, scope, branch, index) => {
    const option = (event.options || [])[index];
    const gain = totalGrowthGain(container.effects);
    if (gain <= 4) return;
    const required = gain > 7 ? 2 : 1;
    let slot = (index + (branch === 'failure' ? 1 : 0)) % 3;
    let guard = 0;
    while (countCosts(container, option) < required && guard < 4) {
      injectCost(container, slot);
      slot += 1;
      guard += 1;
    }
  });

  // ===== 选择结果叙事（resultText）自动补全 =====
  function stableHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  const NEUTRAL_LINES = [
    '科室群里立刻多了一条「已阅」，没人解释「阅」的是什么。',
    '这件事在你的人生里只占三行字，在排班表上却占了一整格。',
    '你把它写进了工作日志，标题栏自动填成了「常规」。',
    '流程走完了，流程为什么是这样，仍然没有人知道。',
    '系统提示「保存成功」，然后卡了八秒才真的保存。',
    '你意识到成年人的世界里，大部分选择都不发朋友圈。',
    '第二天早交班时，没有人提起这件事，包括你自己。',
    '通知发下来时写着「即日起执行」，落款日期是上周。',
    '你在 Excel 里给它填了个颜色，橙色，代表「说不清」。',
    '事情办完了，你收获了一条经验和两条待办。',
    '你把这一页翻过去，纸背面还有下一页。',
    '院内 OA 弹了个窗，标题是「关于进一步做好相关工作的通知」。',
    '这件事最后被总结成一句话：「按规定办」。',
    '你按下确认键，屏幕右下角弹出天气预报：明日有雨。',
    '你忽然觉得，人生和病历一样，都得写「诊疗计划」。',
    '走廊尽头的自动售货机又卡了一次，和你的心情同步。'
  ];

  const SUCCESS_LINES = [
    '成了。你没敢庆祝太久，因为下一条医嘱已经在等你。',
    '结果不错，代价是你今晚又要靠泡面维持体面。',
    '有人在群里发了个「厉害」，然后立刻@你接下一个活。',
    '这次是你赢了。奖励是：更多的工作机会。',
    '事情落地了，你在心里给自己发了一朵不存在的小红花。',
    '效果很好，好到主任决定以后这类事都交给你。',
    '你完成得漂亮，漂亮到没人再问你累不累。',
    '结果超出预期，超出的部分被写进了别人的汇报材料。',
    '你稳住了局面，也顺便稳住了自己发抖的手。',
    '这一次，经验和运气站在了同一边。',
    '成功了。表格里那格终于可以填绿色。',
    '你听见自己长长地吐了口气，那口气比结论更真实。'
  ];

  const FAILURE_LINES = [
    '没成。你把这件事记进了一个只有自己会看的文件夹。',
    '失败的代价不算致命，但足够让你今晚睡不好。',
    '事情崩了一半，另一半靠同事替你兜住了。',
    '结果不如预期，复盘会上你学会了「客观原因」这个词。',
    '你没做成，但至少知道了下次别怎么做。',
    '这次是运气不站在你这边，虽然运气从来也没跟你打过招呼。',
    '你被现实按了一下头，头没破，自信破了点。',
    '结局是坏的，好在坏得很有教育意义。',
    '你写了份情况说明，字数比事情本身还多。',
    '事情没办成，倒是把流程摸熟了。',
    '你安慰自己：医学是经验科学，经验就是这么来的。',
    '失败像夜班一样，来了就得接着。'
  ];

  const CONSEQUENCE_PREFIX = '必然后果：';

  function cleanFeedback(text) {
    if (!text) return '';
    return String(text)
      .replace(/^判定(成功|失败)(（[^）]*）)?[:：]?\s*/, '')
      .replace(/^[（(][^）)]*[）)]\s*/, '')
      .trim();
  }

  function optionSummary(option) {
    const raw = String(option?.text || '').trim();
    if (!raw) return '这个决定';
    return raw.length > 26 ? `${raw.slice(0, 26)}…` : raw;
  }

  function ensureSentence(text) {
    if (!text) return '';
    return /[。！？…」）)]$/.test(text) ? text : `${text}。`;
  }

  function buildResultText(container, event, branch, index, option) {
    const seed = stableHash(`${event.id}|${index}|${branch}|${optionSummary(option)}`);
    const pool = branch === 'success' ? SUCCESS_LINES : branch === 'failure' ? FAILURE_LINES : NEUTRAL_LINES;
    const humor = pool[seed % pool.length];
    let lead = cleanFeedback(container.feedback) || cleanFeedback(container.log);
    if (!lead) {
      if (branch === 'success') {
        lead = `你选了「${optionSummary(option)}」，而这一次它真的走通了`;
      } else if (branch === 'failure') {
        lead = `你选了「${optionSummary(option)}」，路走到一半塌了`;
      } else {
        lead = `你选了「${optionSummary(option)}」，日子就顺着这个方向往前挪了一格`;
      }
    }
    return `${ensureSentence(lead)}${humor}`;
  }

  walkIndexedContainers((container, event, scope, branch, index) => {
    if (typeof container.resultText === 'string' && container.resultText.trim()) return;
    const option = (event.options || [])[index];
    container.resultText = buildResultText(container, event, branch, index, option);
  });

  // 必然后果类事件补充语气标签
  for (const event of randomEvents) {
    if (!event.forced && !/^re_forced_/.test(event.id)) continue;
    for (const option of event.options || []) {
      if (option.resultText && !option.resultText.startsWith(CONSEQUENCE_PREFIX)) {
        option.resultText = `${CONSEQUENCE_PREFIX}${option.resultText}`;
      }
    }
  }



  const GAME_DATA = {
    title: '一个中国医学生的一生',
    disclaimer: '本作是虚构与讽刺作品，不构成医学、法律或职业建议。不同地区与机构在 DRG/DIP、医保与管理实践上存在差异；院校层级、城市层级与医院层级均为游戏化抽象。',
    startEventId: 'admission_985_intro',
    startStage: 'undergrad',
    startLog: '你已经收到 985 医学院录取通知书，真正的人生抉择从报到日开始。',
    fallbackEndingId: 'ending_balanced_life',
    statBounds: {
      health: [0, 100],
      stress: [0, 100],
      money: [0, 100],
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
    specialties: specialtyProfiles,
    careerMeta: { enums: careerEnums, labels: careerDisplayNames },
    randomEvents,
    events
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
  }

  global.GAME_DATA = GAME_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
