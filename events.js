(function (global) {
  const GAME_DATA = {
    title: '一个中国医学生的一生',
    disclaimer:
      '本作是虚构与讽刺作品，不构成医学、法律或职业建议。不同地区与机构在 DRG/DIP、医保与管理实践上存在差异。',
    startEventId: 'gaokao_choice',
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
    events: [
      {
        id: 'gaokao_choice',
        stage: 'gaokao',
        title: '高考出分夜',
        text: '家庭群像 ICU 抢救一样刷新页面。分数够上一本，但离“稳上顶流”差一点。',
        yearDelta: 1,
        options: [
          { text: '冲临床医学（5+3）', target: 'major_confirm', effects: { stress: 6, money: -2, ethics: 4 } },
          { text: '选口腔/影像等相对热门方向', target: 'major_confirm', effects: { stress: 3, money: -1, skill: 2 } },
          { text: '听劝选计算机，退出医疗线', target: 'ending_tech_escape', effects: { health: 5, stress: -20, money: 12 } }
        ]
      },
      {
        id: 'major_confirm',
        stage: 'gaokao',
        title: '填志愿最后 5 分钟',
        text: '“劝人学医，天打雷劈”表情包刷屏。你盯着提交按钮，心跳飙升。',
        yearDelta: 0,
        options: [
          { text: '坚持学医，签下漫长主线', target: 'admission_notice', effects: { ethics: 5, stress: 4 }, flagsSet: ['committed_medicine'] },
          { text: '选生物相关，保留转向空间', target: 'admission_notice', effects: { research: 4, stress: 2, money: -1 }, flagsSet: ['bio_background'] }
        ]
      },
      {
        id: 'admission_notice',
        stage: 'undergrad',
        title: '录取通知书到手',
        text: '你正式进入医学院。亲戚说“以后看病靠你了”，你笑着点头。',
        yearDelta: 1,
        options: [
          { text: '先熟悉课程与时间管理', target: 'freshman_life', effects: { health: 3, stress: -2, skill: 2 } },
          { text: '加入新生群当活跃分子', target: 'freshman_life', effects: { network: 6, stress: 1 } }
        ]
      },
      {
        id: 'freshman_life',
        stage: 'undergrad',
        title: '大一适应期',
        text: '课表像拼图，早八、晚课、自习室排队。你需要建立生存节奏。',
        yearDelta: 1,
        options: [
          { text: '规律作息，稳扎稳打', target: 'anatomy_lab', effects: { health: 6, stress: -4, skill: 2 } },
          { text: '白天上课，晚上社团卷活动', target: 'anatomy_lab', effects: { network: 7, stress: 5, health: -3 } },
          { text: '疯狂刷题争奖学金', target: 'anatomy_lab', effects: { skill: 5, money: 5, stress: 6 } }
        ]
      },
      {
        id: 'anatomy_lab',
        stage: 'undergrad',
        title: '解剖课第一天',
        text: '手套、器械、沉默。你第一次直面“医学不是 PPT”。',
        yearDelta: 1,
        options: [
          { text: '认真练习并整理笔记', target: 'biochem_week', effects: { skill: 6, ethics: 2, stress: 3 } },
          { text: '硬着头皮跟队友走流程', target: 'biochem_week', effects: { stress: 1, skill: 2 } },
          { text: '课后打工缓解生活费压力', target: 'biochem_week', effects: { money: 6, health: -4, stress: 3 } }
        ]
      },
      {
        id: 'biochem_week',
        stage: 'undergrad',
        title: '生化考试周',
        text: '背代谢通路背到梦里还在循环。咖啡与红牛成为“器官系统”。',
        yearDelta: 1,
        options: [
          { text: '组队复习，互相抽背', target: 'clerkship_intro', effects: { skill: 4, network: 3, stress: 2 } },
          { text: '单刷到凌晨，冲高分', target: 'clerkship_intro', effects: { skill: 7, health: -6, stress: 7 } },
          { text: '临时抱佛脚，及格万岁', target: 'clerkship_intro', effects: { stress: 1, skill: 1, ethics: -1 } }
        ]
      },
      {
        id: 'clerkship_intro',
        stage: 'undergrad',
        title: '首次见习',
        text: '老师说：“先学会看、听、记，再谈操作。”你开始接触真实病区节奏。',
        yearDelta: 1,
        options: [
          { text: '主动问老师和住院医问题', target: 'campus_meme_night', effects: { skill: 5, network: 3, stress: 2 } },
          { text: '低调观察，避免打扰临床', target: 'campus_meme_night', effects: { stress: -1, skill: 3, ethics: 2 } },
          { text: '只打卡不深究', target: 'campus_meme_night', effects: { stress: -2, skill: 1 } }
        ]
      },
      {
        id: 'campus_meme_night',
        stage: 'undergrad',
        title: '值班群梗图之夜',
        text: '群里刷“这个病人你收一下”“下班前最后一个会诊”。笑完后你意识到这可能是未来日常。',
        yearDelta: 0,
        options: [
          { text: '当段子看，缓解焦虑', target: 'mentor_choice', effects: { stress: -4, health: 2 } },
          { text: '认真记下前辈建议', target: 'mentor_choice', effects: { skill: 3, legalRisk: -2, ethics: 2 } },
          { text: '开始怀疑要不要继续', target: 'mentor_choice', effects: { stress: 4, ethics: -2 } }
        ]
      },
      {
        id: 'mentor_choice',
        stage: 'undergrad',
        title: '考研/保研分流前夜',
        text: '你需要决定未来：临床深耕、科研导向，还是先就业后看。',
        yearDelta: 1,
        options: [
          { text: '冲考研：目标三甲平台', target: 'entrance_exam_prep', effects: { stress: 8, skill: 4, research: 2 }, flagsSet: ['postgrad_track'] },
          { text: '争取保研：提前进实验室', target: 'lab_entry', effects: { research: 6, network: 4, stress: 5 }, flagsSet: ['postgrad_track'] },
          { text: '先就业：准备执业考试与规培', target: 'license_exam_prep', effects: { money: 3, stress: 3, skill: 3 }, flagsSet: ['direct_training'] }
        ]
      },
      {
        id: 'entrance_exam_prep',
        stage: 'graduate',
        title: '考研冲刺',
        text: '图书馆座位像抢号。你和同学比谁先背完厚厚一本内科学。',
        yearDelta: 1,
        options: [
          { text: '系统复盘，稳步推进', target: 'grad_admission', effects: { skill: 5, stress: 4, health: -2 } },
          { text: '极限熬夜，拼命上岸', target: 'grad_admission', effects: { skill: 7, stress: 8, health: -7 } },
          { text: '求助师兄师姐押题', target: 'grad_admission', effects: { network: 4, stress: 3, money: -2 } }
        ]
      },
      {
        id: 'grad_admission',
        stage: 'graduate',
        title: '拟录取通知',
        text: '你上岸了。喜悦还没结束，导师选择焦虑马上接力。',
        yearDelta: 0,
        options: [
          { text: '选科研强势导师', target: 'lab_entry', effects: { research: 7, stress: 5 }, flagsSet: ['strong_pi'] },
          { text: '选临床教学平衡导师', target: 'lab_entry', effects: { skill: 4, network: 3, stress: 3 } },
          { text: '选“放养型”导师', target: 'lab_entry', effects: { health: 2, research: 2, stress: 1 } }
        ]
      },
      {
        id: 'lab_entry',
        stage: 'graduate',
        title: '研究生第一学期',
        text: '白天门诊跟班，晚上实验和文献，时间被切成碎片。',
        yearDelta: 1,
        options: [
          { text: '主攻实验，先冲课题', target: 'experiment_failure', effects: { research: 8, stress: 6, health: -4 } },
          { text: '临床科研两手抓', target: 'experiment_failure', effects: { skill: 4, research: 5, stress: 5 } },
          { text: '多参加科室活动积累关系', target: 'experiment_failure', effects: { network: 7, research: 2, stress: 3 } }
        ]
      },
      {
        id: 'experiment_failure',
        stage: 'graduate',
        title: '实验重复失败',
        text: '第 6 次重复后，结果依然像在和你开玩笑。你要怎么应对？',
        yearDelta: 1,
        options: [
          { text: '复盘流程，找统计老师帮忙', target: 'paper_deadline', effects: { research: 5, network: 3, stress: 3 } },
          { text: '硬扛不求助', target: 'paper_deadline', effects: { stress: 8, health: -5, research: 2 } },
          { text: '数据先“好看一点”再说', target: 'paper_deadline', effects: { research: 3, legalRisk: 10, ethics: -10 }, flagsSet: ['questionable_research'] }
        ]
      },
      {
        id: 'paper_deadline',
        stage: 'graduate',
        title: '论文截止倒计时',
        text: '导师提醒“毕业线先过”。你在质量、速度和底线间挣扎。',
        yearDelta: 1,
        options: [
          { text: '按规范补实验，宁慢勿假', target: 'conference_choice', effects: { research: 6, ethics: 5, stress: 6 } },
          { text: '投稿一般期刊先保毕业', target: 'conference_choice', effects: { research: 3, stress: 2, money: -2 } },
          {
            text: '借用“模板化写作服务”',
            target: 'conference_choice',
            effects: { research: 2, money: -8, legalRisk: 8, ethics: -8 },
            flagsSet: ['paper_risk'],
            delayed: [{ turns: 3, effects: { legalRisk: 12, stress: 8 }, log: '学术诚信抽检触发：你被要求补充原始材料。' }]
          }
        ]
      },
      {
        id: 'conference_choice',
        stage: 'graduate',
        title: '学术会议机会',
        text: '你拿到一次口头汇报机会，也可把预算省下来。',
        yearDelta: 0,
        options: [
          { text: '去参会并主动社交', target: 'license_exam_prep', effects: { network: 8, research: 4, money: -5 } },
          { text: '线上参会，省钱省时间', target: 'license_exam_prep', effects: { research: 2, money: 2, stress: -1 } },
          { text: '放弃会议，专心备考执医', target: 'license_exam_prep', effects: { skill: 4, stress: 1 } }
        ]
      },
      {
        id: 'license_exam_prep',
        stage: 'training',
        title: '执业医师考试准备',
        text: '白天轮转、晚上刷题，模拟题错得你怀疑人生。',
        yearDelta: 1,
        options: [
          { text: '按计划刷题 + 临床复盘', target: 'license_exam_result', effects: { skill: 6, stress: 4 } },
          { text: '押题突击', target: 'license_exam_result', effects: { skill: 3, stress: 2 } },
          { text: '报高价培训班', target: 'license_exam_result', effects: { skill: 5, money: -10, stress: 3 } }
        ]
      },
      {
        id: 'license_exam_result',
        stage: 'training',
        title: '执医出分',
        text: '成绩公布，群里“过了请喝奶茶”的消息刷屏。',
        yearDelta: 0,
        options: [
          {
            text: '平稳接受结果，继续前进',
            target: 'residency_match',
            effects: { stress: -3, skill: 2 },
            randomTargets: [
              { target: 'residency_match', weight: 75 },
              { target: 'license_retake', weight: 25 }
            ]
          },
          { text: '立刻联系前辈找规培去向', target: 'residency_match', effects: { network: 5, stress: -1 } }
        ]
      },
      {
        id: 'license_retake',
        stage: 'training',
        title: '补考年',
        text: '你决定再战一年。外界质疑很多，但你还想坚持。',
        yearDelta: 1,
        options: [
          { text: '系统查漏补缺', target: 'residency_match', effects: { skill: 6, stress: 5, health: -2 } },
          { text: '暂时打工维持生活', target: 'residency_match', effects: { money: 8, skill: 2, stress: 3 } }
        ]
      },
      {
        id: 'residency_match',
        stage: 'training',
        title: '规培去向选择',
        text: '你收到多个机会：三甲高压、地市医院平衡、基层锻炼。',
        yearDelta: 1,
        options: [
          { text: '去三甲，见识最复杂病例', target: 'drg_bootcamp', effects: { skill: 8, stress: 8, money: 3 }, flagsSet: ['tier3_path'] },
          { text: '去地市医院，追求稳定成长', target: 'drg_bootcamp', effects: { skill: 5, stress: 4, health: 2 }, flagsSet: ['city_hospital_path'] },
          { text: '去基层先扎根社区', target: 'grassroots_early', effects: { ethics: 6, network: 4, money: 2 }, flagsSet: ['grassroots_path'] }
        ]
      },
      {
        id: 'grassroots_early',
        stage: 'training',
        title: '基层首年',
        text: '你面对的是慢病管理、签约服务和公共卫生台账。',
        yearDelta: 1,
        options: [
          { text: '认真做随访与健康宣教', target: 'night_shift_call', effects: { ethics: 6, network: 5, stress: 2 } },
          { text: '尽量少惹事，流程化处理', target: 'night_shift_call', effects: { stress: -1, skill: 2 } }
        ]
      },
      {
        id: 'drg_bootcamp',
        stage: 'training',
        title: 'DRG/DIP 培训周',
        text: '科室讨论“合理诊疗、医保控费、病组权重、床位周转”如何平衡。',
        yearDelta: 0,
        options: [
          {
            text: '学习规范编码与路径管理',
            target: 'night_shift_call',
            effects: { skill: 5, legalRisk: -4, stress: 2 },
            flagsSet: ['drg_literate']
          },
          {
            text: '只盯绩效指标，压缩检查',
            target: 'night_shift_call',
            effects: { money: 6, ethics: -6, legalRisk: 8, stress: 4 },
            flagsSet: ['over_controlled_cost'],
            delayed: [{ turns: 2, effects: { legalRisk: 10, stress: 6 }, log: '一例复诊患者对“过度控费”提出质疑。' }]
          },
          {
            text: '和上级沟通个体化诊疗边界',
            target: 'night_shift_call',
            effects: { network: 4, ethics: 4, stress: 3 },
            flagsSet: ['balanced_drg']
          }
        ]
      },
      {
        id: 'night_shift_call',
        stage: 'resident',
        title: '凌晨三点电话响了',
        text: '“这个病人你收一下。”值班室灯光惨白，走廊回声像加速心率。',
        yearDelta: 1,
        options: [
          {
            text: '立刻到床旁评估并补全病历',
            target: 'ward_rounds',
            effects: { skill: 5, stress: 5, legalRisk: -2 },
            flagsSet: ['solid_records']
          },
          {
            text: '先电话指导，稍后再看',
            target: 'ward_rounds',
            effects: { stress: 1, skill: 1, legalRisk: 5 },
            delayed: [{ turns: 1, effects: { legalRisk: 5, stress: 3 }, log: '病情变化后追问处理时效，你感到压力陡增。' }]
          },
          {
            text: '让同事先顶一下，自己补觉',
            target: 'ward_rounds',
            effects: { health: 3, network: -4, legalRisk: 6, ethics: -4 }
          }
        ]
      },
      {
        id: 'ward_rounds',
        stage: 'resident',
        title: '晨交班与病历海',
        text: '夜班后直接晨会，你要在疲劳中保持病历质量与沟通清晰。',
        yearDelta: 0,
        options: [
          { text: '逐条核对病历与医嘱', target: 'patient_talk', effects: { skill: 4, legalRisk: -3, stress: 4 } },
          {
            text: '套模板快写，先把量交上去',
            target: 'patient_talk',
            effects: { stress: -1, money: 3, legalRisk: 8, ethics: -5 },
            flagsSet: ['record_shortcut'],
            delayed: [{ turns: 2, effects: { legalRisk: 12, stress: 8 }, log: '病历内在逻辑被质控点名。' }]
          },
          { text: '请高年资医生帮你复核', target: 'patient_talk', effects: { network: 3, legalRisk: -2, stress: 2 } }
        ]
      },
      {
        id: 'patient_talk',
        stage: 'resident',
        title: '沟通关键时刻',
        text: '家属追问方案选择和费用。你需要在同理心、事实和制度间解释清楚。',
        yearDelta: 0,
        options: [
          { text: '详细解释风险、收益与替代方案', target: 'consultation_lastminute', effects: { ethics: 6, legalRisk: -5, stress: 3, skill: 2 }, flagsSet: ['good_communication'] },
          { text: '只给结论，尽快结束谈话', target: 'consultation_lastminute', effects: { stress: -2, legalRisk: 5, ethics: -3 } },
          { text: '请上级共同沟通', target: 'consultation_lastminute', effects: { network: 4, legalRisk: -2, stress: 1 } }
        ]
      },
      {
        id: 'consultation_lastminute',
        stage: 'resident',
        title: '下班前最后一个会诊',
        text: '电梯门快关时电话响起：急会诊。你已经 30 小时没好好休息。',
        yearDelta: 1,
        options: [
          {
            text: '立即响应并完整评估',
            target: 'complaint_case',
            effects: { skill: 6, stress: 6, health: -4, legalRisk: -2 },
            randomTargets: [
              { target: 'complaint_case', weight: 80 },
              { target: 'rare_recognition', weight: 20 }
            ]
          },
          { text: '和对方科室沟通分级处理', target: 'complaint_case', effects: { network: 4, stress: 3, legalRisk: -1 } },
          { text: '情绪化拒绝：我真下班了', target: 'complaint_case', effects: { health: 2, network: -8, legalRisk: 6, ethics: -4 } }
        ]
      },
      {
        id: 'rare_recognition',
        stage: 'resident',
        title: '一封感谢信',
        text: '你帮助的患者家属送来手写感谢信，科室群难得刷起“辛苦了”。',
        yearDelta: 0,
        options: [
          { text: '继续保持耐心和规范', target: 'complaint_case', effects: { ethics: 5, stress: -4, health: 2 }, flagsSet: ['patient_recognized'] },
          { text: '低调收好，继续干活', target: 'complaint_case', effects: { stress: -2, skill: 2 } }
        ]
      },
      {
        id: 'complaint_case',
        stage: 'resident',
        title: '投诉与纠纷苗头',
        text: '一位患者对等待时间和费用不满，准备投诉。你必须迅速应对。',
        yearDelta: 0,
        options: [
          { text: '马上复盘流程并补充沟通记录', target: 'performance_review', effects: { legalRisk: -6, stress: 4, skill: 2 } },
          { text: '把问题全推给系统', target: 'performance_review', effects: { stress: -1, legalRisk: 8, network: -3, ethics: -4 } },
          { text: '请医务与法务提前介入', target: 'performance_review', effects: { legalRisk: -4, network: 4, stress: 2 }, flagsSet: ['legal_awareness'] }
        ]
      },
      {
        id: 'performance_review',
        stage: 'resident',
        title: '绩效考核月',
        text: '考核看病组权重、病历质量、满意度、床位周转。你怎么取舍？',
        yearDelta: 1,
        options: [
          { text: '坚持规范，宁可慢一点', target: 'ai_and_online', effects: { money: 1, legalRisk: -3, ethics: 4, stress: 4 } },
          { text: '全力冲量冲周转', target: 'ai_and_online', effects: { money: 8, stress: 6, health: -4, legalRisk: 5 }, flagsSet: ['volume_first'] },
          { text: '和团队优化流程，减少无效消耗', target: 'ai_and_online', effects: { money: 4, network: 4, stress: 2, skill: 3 } }
        ]
      },
      {
        id: 'ai_and_online',
        stage: 'resident',
        title: 'AI 辅助与互联网问诊',
        text: '医院试点 AI 病历辅助和线上复诊。效率提升与误用风险并存。',
        yearDelta: 0,
        options: [
          { text: '把 AI 当助手，所有关键结论人工复核', target: 'promotion_gate', effects: { skill: 4, legalRisk: -3, stress: -1 }, flagsSet: ['ai_prudent'] },
          { text: '照单全收 AI 建议', target: 'promotion_gate', effects: { stress: -2, skill: 1, legalRisk: 8, ethics: -3 }, flagsSet: ['ai_overtrust'] },
          { text: '拒绝使用，全部手写', target: 'promotion_gate', effects: { skill: 2, stress: 4, health: -2 } }
        ]
      },
      {
        id: 'promotion_gate',
        stage: 'senior',
        title: '主治晋升门槛',
        text: '你来到职业分叉口：继续院内晋升，或转向其他赛道。',
        yearDelta: 1,
        options: [
          {
            text: '冲副高/科室管理路线',
            target: 'chief_competition',
            effects: { stress: 6, skill: 4, network: 4 },
            conditions: { stats: { skill: { min: 45 } } }
          },
          { text: '走科研与教学路线', target: 'research_track', effects: { research: 8, stress: 5 }, conditions: { stats: { research: { min: 35 } } } },
          { text: '去基层长期发展', target: 'grassroots_track', effects: { ethics: 6, health: 2, money: -2 } },
          { text: '转向企业/互联网/考公', target: 'alt_career_track', effects: { stress: -3, money: 5 } }
        ]
      },
      {
        id: 'chief_competition',
        stage: 'senior',
        title: '副高与主任竞争',
        text: '名额极少。你需要平衡临床、教学、科研与团队协作。',
        yearDelta: 2,
        options: [
          {
            text: '长期打磨带教与疑难病例能力',
            target: 'senior_outcome',
            effects: { skill: 8, ethics: 4, stress: 5 },
            flagsSet: ['chief_candidate']
          },
          {
            text: '重点经营人脉与行政沟通',
            target: 'senior_outcome',
            effects: { network: 8, stress: 4, research: -1 },
            flagsSet: ['admin_networking']
          },
          {
            text: '疲惫不堪，考虑提前离开一线',
            target: 'alt_career_track',
            effects: { health: 2, stress: -5 }
          }
        ]
      },
      {
        id: 'research_track',
        stage: 'senior',
        title: '科研与教学主线',
        text: '你主导课题、带学生、申请基金。成果与失败都被放大。',
        yearDelta: 2,
        options: [
          { text: '坚持规范与原创性', target: 'senior_outcome', effects: { research: 9, ethics: 5, stress: 5 }, flagsSet: ['clean_research'] },
          { text: '追热点、快发文', target: 'senior_outcome', effects: { research: 6, stress: 4, legalRisk: 5 }, flagsSet: ['rush_research'] },
          { text: '转去医工交叉企业', target: 'alt_career_track', effects: { money: 8, stress: -2 } }
        ]
      },
      {
        id: 'grassroots_track',
        stage: 'senior',
        title: '基层与公共卫生路线',
        text: '你在社区做慢病、筛查、签约管理，成就感和琐碎并存。',
        yearDelta: 2,
        options: [
          { text: '深耕全科与居民信任', target: 'senior_outcome', effects: { ethics: 8, network: 6, money: 2 }, flagsSet: ['community_trust'] },
          { text: '转向行政与卫生管理', target: 'senior_outcome', effects: { network: 7, stress: 2, skill: -1 }, flagsSet: ['public_admin'] },
          { text: '觉得回报太慢，改去民营', target: 'private_track', effects: { money: 6, stress: 1 } }
        ]
      },
      {
        id: 'alt_career_track',
        stage: 'senior',
        title: '转行十字路口',
        text: '你考虑药械、互联网医疗、科普博主或考公。医学背景依然是底牌。',
        yearDelta: 1,
        options: [
          { text: '加入药械企业做医学事务', target: 'ending_industry_ma', effects: { money: 15, stress: -8, skill: 2 } },
          { text: '做互联网医疗与线上管理', target: 'ending_internet_health', effects: { money: 10, stress: -4, legalRisk: 4 } },
          { text: '备考公务员进卫健系统', target: 'ending_public_service', effects: { stress: -3, network: 4, ethics: 3 } },
          { text: '回归临床再拼一把', target: 'private_track', effects: { stress: 5, skill: 3 } }
        ]
      },
      {
        id: 'private_track',
        stage: 'senior',
        title: '民营医院机会',
        text: '薪酬更高，但绩效与口碑压力同样直接。',
        yearDelta: 1,
        options: [
          { text: '坚持规范与患者体验并重', target: 'senior_outcome', effects: { money: 10, ethics: 5, legalRisk: -2 }, flagsSet: ['private_balanced'] },
          { text: '重营销轻随访，追求短期收益', target: 'senior_outcome', effects: { money: 14, legalRisk: 10, ethics: -8 }, flagsSet: ['private_aggressive'] }
        ]
      },
      {
        id: 'senior_outcome',
        stage: 'senior',
        title: '职业后期关键抉择',
        text: '多年积累进入结算期。你会迎来怎样的职业归宿？',
        yearDelta: 5,
        options: [
          {
            text: '继续坚守到退休',
            target: 'ending_retire_respect',
            effects: { health: -4, stress: 2 },
            conditions: { stats: { ethics: { min: 55 }, legalRisk: { max: 60 }, skill: { min: 55 } }, flags: ['good_communication'] }
          },
          {
            text: '冲击科主任',
            target: 'ending_department_chief',
            effects: { stress: 8 },
            conditions: {
              stats: { skill: { min: 75 }, research: { min: 60 }, network: { min: 65 }, legalRisk: { max: 45 }, ethics: { min: 50 } },
              flags: ['chief_candidate']
            }
          },
          {
            text: '成为科研教学骨干',
            target: 'ending_academic_pillar',
            effects: { stress: 4 },
            conditions: { stats: { research: { min: 78 }, ethics: { min: 45 }, legalRisk: { max: 55 } } }
          },
          {
            text: '转向更平衡的生活',
            target: 'ending_balanced_life',
            effects: { health: 8, stress: -12 }
          }
        ]
      },

      {
        id: 'ending_tech_escape',
        stage: 'ending',
        type: 'ending',
        title: '结局：代码比值班灯更亮',
        text: '你没走医学主线，过上了另一种高压但可控的人生。偶尔看见医学生梗图，会默默点个赞。'
      },
      {
        id: 'ending_department_chief',
        stage: 'ending',
        type: 'ending',
        title: '结局：少数人的科主任',
        text: '你在长期积累中脱颖而出，终于带领团队。荣耀背后是无数夜班和谨慎决策。'
      },
      {
        id: 'ending_academic_pillar',
        stage: 'ending',
        type: 'ending',
        title: '结局：学术与临床双线骨干',
        text: '你不是流量神话，却在学术与带教中持续发光。学生和患者都记得你的严谨。'
      },
      {
        id: 'ending_retire_respect',
        stage: 'ending',
        type: 'ending',
        title: '结局：平凡而被尊重的退休',
        text: '你或许没有头衔巅峰，但在长期稳定行医中赢得同事和患者的信任。'
      },
      {
        id: 'ending_balanced_life',
        stage: 'ending',
        type: 'ending',
        title: '结局：及时转弯的人生平衡',
        text: '你保留专业身份，也把生活找了回来。不是逃离，而是重新定义成功。'
      },
      {
        id: 'ending_industry_ma',
        stage: 'ending',
        type: 'ending',
        title: '结局：医学事务转身',
        text: '你把临床经验转化为产业价值。争议仍在，但你学会了在边界内推动改进。'
      },
      {
        id: 'ending_internet_health',
        stage: 'ending',
        type: 'ending',
        title: '结局：互联网医疗航道',
        text: '你在效率、合规与可及性间找平衡。键盘另一端依然是真实的人。'
      },
      {
        id: 'ending_public_service',
        stage: 'ending',
        type: 'ending',
        title: '结局：公共治理路线',
        text: '你离开一线听诊器，走进政策与管理。改变很慢，但你在做系统层面的努力。'
      },
      {
        id: 'ending_crisis_health',
        stage: 'ending',
        type: 'ending',
        title: '结局：身体先按下暂停键',
        text: '长期透支后你被迫休整。恢复比坚持更需要勇气。'
      },
      {
        id: 'ending_crisis_stress',
        stage: 'ending',
        type: 'ending',
        title: '结局：情绪系统超负荷',
        text: '你在高压中失去平衡，决定先求助、先活下来。职业道路需要重启。'
      },
      {
        id: 'ending_crisis_legal',
        stage: 'ending',
        type: 'ending',
        title: '结局：法律风险反噬',
        text: '一次次边界试探最终累积成实质后果。你不得不付出沉重代价。'
      },
      {
        id: 'ending_ethics_fall',
        stage: 'ending',
        type: 'ending',
        title: '结局：初心掉线',
        text: '你还在岗位上，却不再相信这份职业。名义上的成功无法抵消内耗。'
      }
    ]
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GAME_DATA;
  }
  global.GAME_DATA = GAME_DATA;
})(typeof window !== 'undefined' ? window : globalThis);
