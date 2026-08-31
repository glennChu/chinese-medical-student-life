(function (global) {
  const GAME_DATA = {
    title: '一个中国医学生的一生',
    disclaimer:
      '本作是虚构与讽刺作品，不构成医学、法律或职业建议。不同地区与机构在 DRG/DIP、医保与管理实践上存在差异。',
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
    events: [
      {
        id: 'gaokao_choice',
        stage: 'gaokao',
        major: true,
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
        major: true,
        title: '考研/保研分流前夜',
        text: '你需要决定未来：临床深耕、科研导向，还是先就业后看。',
        yearDelta: 1,
        options: [
          { text: '冲考研：目标三甲平台', target: 'entrance_exam_prep', effects: { stress: 8, skill: 4, research: 2 }, flagsSet: ['postgrad_track'] },
          { text: '争取保研：提前进实验室', target: 'recommendation_panel', effects: { research: 6, network: 4, stress: 5 }, flagsSet: ['postgrad_track'] },
          { text: '先就业：准备执业考试与规培', target: 'license_exam_prep', effects: { money: 3, stress: 3, skill: 3 }, flagsSet: ['direct_training'] }
        ]
      },
      {
        id: 'recommendation_panel',
        stage: 'graduate',
        major: true,
        title: '保研面试组会',
        text: '推免名额有限，老师们会看成绩、项目经历、表达和临场稳定度。',
        yearDelta: 0,
        options: [
          {
            text: '拿着成绩和项目去争取推免名额',
            effects: { stress: 4, research: 2 },
            check: {
              baseChance: 50,
              stats: { research: 0.45, skill: 0.3, network: 0.25, stress: -0.2, ethics: 0.15 },
              minChance: 20,
              maxChance: 85,
              success: {
                target: 'grad_admission',
                effects: { network: 2, stress: -2 },
                feedback: '老师认可了你的积累，你顺利拿到推免资格。',
                log: '判定成功（保研）：老师认可了你的成绩和项目，你顺利拿到推免资格。'
              },
              failure: {
                target: 'entrance_exam_prep',
                effects: { stress: 6, health: -2 },
                feedback: '名额被更强的同学拿走，你只能立刻转入统考冲刺。',
                log: '判定失败（保研）：推免名额旁落，你只能临时切回统考战场。'
              }
            }
          },
          { text: '别等结果了，直接全力准备统考', target: 'entrance_exam_prep', effects: { skill: 3, stress: 3 } }
        ]
      },
      {
        id: 'entrance_exam_prep',
        stage: 'graduate',
        major: true,
        title: '考研冲刺',
        text: '图书馆座位像抢号。你和同学比谁先背完厚厚一本内科学。',
        yearDelta: 1,
        options: [
          {
            text: '系统复盘，稳步推进',
            effects: { skill: 5, stress: 4, health: -2 },
            check: {
              baseChance: 48,
              stats: { skill: 0.55, research: 0.25, health: 0.15, stress: -0.35 },
              minChance: 18,
              maxChance: 88,
              success: {
                target: 'grad_admission',
                effects: { stress: -3, skill: 2 },
                feedback: '你顺利过线并拿到拟录取。',
                log: '判定成功（考研）：你顺利过线并拿到目标院校拟录取。'
              },
              failure: {
                target: 'grad_waiting_year',
                effects: { stress: 8, health: -2 },
                feedback: '分数差了一口气，只能考虑调剂、延后或转向。',
                log: '判定失败（考研）：你与目标院校擦肩而过，只能进入补救路线。'
              }
            }
          },
          {
            text: '极限熬夜，拼命上岸',
            effects: { skill: 7, stress: 8, health: -7 },
            check: {
              baseChance: 52,
              stats: { skill: 0.6, health: 0.1, stress: -0.5, research: 0.15 },
              minChance: 15,
              maxChance: 84,
              success: {
                target: 'grad_admission',
                effects: { skill: 2, stress: -2 },
                feedback: '你硬是把自己卷进了上岸名单。',
                log: '判定成功（考研）：你靠极限冲刺挤进了上岸名单。'
              },
              failure: {
                target: 'grad_waiting_year',
                effects: { stress: 10, health: -3 },
                feedback: '身体和心态先扛不住了，结果也没能稳住。',
                log: '判定失败（考研）：高压备考反噬，你不得不接受失利。'
              }
            }
          },
          {
            text: '求助师兄师姐押题',
            effects: { network: 4, stress: 3, money: -2 },
            check: {
              baseChance: 44,
              stats: { network: 0.5, skill: 0.35, stress: -0.25, money: 0.05 },
              minChance: 20,
              maxChance: 80,
              success: {
                target: 'grad_admission',
                effects: { stress: -2, network: 2 },
                feedback: '前辈给的方向很准，你惊险上岸。',
                log: '判定成功（考研）：前辈的经验确实帮你卡住了关键分。'
              },
              failure: {
                target: 'grad_waiting_year',
                effects: { stress: 6 },
                feedback: '押题不等于押中，你还是差了临门一脚。',
                log: '判定失败（考研）：经验可以借，但分数终究要自己考出来。'
              }
            }
          }
        ]
      },
      {
        id: 'grad_waiting_year',
        stage: 'graduate',
        title: '上岸失之交臂后',
        text: '你站在调剂、二战和直接上岗的路口，必须尽快重新规划。',
        yearDelta: 1,
        options: [
          { text: '接受调剂，先读临床专硕', target: 'grad_admission', effects: { skill: 3, research: 2, stress: 1 } },
          { text: '放弃继续读研，直接转执医与规培', target: 'license_exam_prep', effects: { money: 2, skill: 2, stress: 2 }, flagsSet: ['direct_training'] }
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
          {
            text: '复盘流程，找统计老师帮忙',
            effects: { research: 5, network: 3, stress: 3 },
            check: {
              baseChance: 55,
              stats: { research: 0.55, network: 0.3, ethics: 0.15, stress: -0.3 },
              minChance: 20,
              maxChance: 90,
              success: {
                target: 'paper_deadline',
                effects: { research: 3, stress: -2 },
                feedback: '你终于找到了关键 bug，课题重新转起来了。',
                log: '判定成功（实验）：你在外援帮助下找到了实验卡点。'
              },
              failure: {
                target: 'project_delay',
                effects: { stress: 6, health: -2 },
                feedback: '问题比想象中更深，课题被迫延期。',
                log: '判定失败（实验）：实验仍然反复失败，只能接受延期。'
              }
            }
          },
          {
            text: '硬扛不求助',
            effects: { stress: 8, health: -5, research: 2 },
            check: {
              baseChance: 34,
              stats: { research: 0.35, health: 0.1, stress: -0.45 },
              minChance: 10,
              maxChance: 70,
              success: {
                target: 'paper_deadline',
                effects: { research: 2 },
                feedback: '你居然硬扛了出来，但代价不小。',
                log: '判定成功（实验）：你靠死磕把实验推进了下去。'
              },
              failure: {
                target: 'project_delay',
                effects: { stress: 8, health: -3 },
                feedback: '单打独斗没能解决问题，时间先被耗尽了。',
                log: '判定失败（实验）：你把自己熬坏了，实验却没有转机。'
              }
            }
          },
          { text: '数据先“好看一点”再说', target: 'paper_deadline', effects: { research: 3, legalRisk: 10, ethics: -10 }, flagsSet: ['questionable_research'] }
        ]
      },
      {
        id: 'project_delay',
        stage: 'graduate',
        title: '课题延期警报',
        text: '进度会上，导师提醒你：再拖下去，毕业和临床节奏都会被打乱。',
        yearDelta: 0,
        options: [
          { text: '补做一轮实验，咬牙把线补齐', target: 'paper_deadline', effects: { research: 3, stress: 4, health: -2 } },
          { text: '调整目标，先保毕业线和后续执医安排', target: 'paper_revision_year', effects: { stress: 2, money: -1 } }
        ]
      },
      {
        id: 'paper_deadline',
        stage: 'graduate',
        title: '论文截止倒计时',
        text: '导师提醒“毕业线先过”。你在质量、速度和底线间挣扎。',
        yearDelta: 1,
        options: [
          {
            text: '按规范补实验，宁慢勿假',
            effects: { research: 6, ethics: 5, stress: 6 },
            check: {
              baseChance: 52,
              stats: { research: 0.5, ethics: 0.3, health: 0.1, stress: -0.25 },
              minChance: 18,
              maxChance: 88,
              success: {
                target: 'conference_choice',
                effects: { research: 3, stress: -2 },
                feedback: '稿件虽然不算神刊，但足够稳妥地过线了。',
                log: '判定成功（论文）：你靠规范和耐心把毕业线稳稳拿下。'
              },
              failure: {
                target: 'paper_revision_year',
                effects: { stress: 5, money: -2 },
                feedback: '审稿意见很重，你需要大修并等待下一轮。',
                log: '判定失败（论文）：稿件被大修，毕业与后续计划都被拖慢。'
              }
            }
          },
          {
            text: '投稿一般期刊先保毕业',
            effects: { research: 3, stress: 2, money: -2 },
            check: {
              baseChance: 58,
              stats: { research: 0.35, network: 0.15, stress: -0.15, money: 0.05 },
              minChance: 25,
              maxChance: 86,
              success: {
                target: 'conference_choice',
                effects: { stress: -1 },
                feedback: '你顺利保住了毕业线，虽然履历不算亮眼。',
                log: '判定成功（论文）：你通过一般期刊投稿稳住了毕业节奏。'
              },
              failure: {
                target: 'paper_revision_year',
                effects: { stress: 3, money: -1 },
                feedback: '保底并不等于必中，你还是被拖进了返修与等待。',
                log: '判定失败（论文）：连保底方案都没一次过，只能补材料再战。'
              }
            }
          },
          {
            text: '借用“模板化写作服务”',
            target: 'paper_revision_year',
            effects: { research: 2, money: -8, legalRisk: 8, ethics: -8 },
            flagsSet: ['paper_risk'],
            delayed: [{ turns: 3, effects: { legalRisk: 12, stress: 8 }, log: '学术诚信抽检触发：你被要求补充原始材料。' }]
          }
        ]
      },
      {
        id: 'paper_revision_year',
        stage: 'graduate',
        title: '返修、等待与补救',
        text: '论文没有直接通过。你要决定继续补，还是把精力先挪给毕业后阶段。',
        yearDelta: 0,
        options: [
          { text: '继续返修，争取把材料补齐', target: 'conference_choice', effects: { research: 2, stress: 3, money: -1 } },
          { text: '先毕业先转临床，论文后面再慢慢补', target: 'license_exam_prep', effects: { skill: 2, stress: 1 } }
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
        major: true,
        title: '执医出分',
        text: '成绩公布，群里“过了请喝奶茶”的消息刷屏。',
        yearDelta: 0,
        options: [
          {
            text: '点开成绩页面，面对真正结果',
            effects: { stress: -3, skill: 2 },
            check: {
              baseChance: 52,
              stats: { skill: 0.65, health: 0.1, stress: -0.3, money: 0.05 },
              minChance: 20,
              maxChance: 92,
              success: {
                target: 'residency_match',
                effects: { stress: -3 },
                feedback: '你顺利通过执业医师考试，可以正式进入下一轮竞争。',
                log: '判定成功（执医）：你顺利通过执业医师考试。'
              },
              failure: {
                target: 'license_retake',
                effects: { stress: 7, health: -1 },
                feedback: '成绩差了几分，你需要补考一年。',
                log: '判定失败（执医）：成绩差了几分，你不得不进入补考年。'
              }
            }
          },
          {
            text: '先联系前辈打听去向，再查分',
            effects: { network: 5, stress: -1 },
            check: {
              baseChance: 49,
              stats: { skill: 0.55, network: 0.25, stress: -0.25, health: 0.1 },
              minChance: 18,
              maxChance: 90,
              success: {
                target: 'residency_match',
                effects: { network: 2, stress: -2 },
                feedback: '分数过线，而且你还提前摸到了规培情报。',
                log: '判定成功（执医）：成绩过线，人脉也让你更快进入下一步。'
              },
              failure: {
                target: 'license_retake',
                effects: { network: 1, stress: 6 },
                feedback: '消息打听到了，但分数还是没有撑住。',
                log: '判定失败（执医）：你知道了岗位信息，却还是先得补考。'
              }
            }
          }
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
        major: true,
        title: '规培去向选择',
        text: '你收到多个机会：三甲高压、地市医院平衡、基层锻炼。',
        yearDelta: 1,
        options: [
          {
            text: '去三甲，见识最复杂病例',
            check: {
              baseChance: 42,
              stats: { skill: 0.45, research: 0.2, network: 0.35, stress: -0.15, legalRisk: -0.2 },
              minChance: 18,
              maxChance: 82,
              success: {
                target: 'drg_bootcamp',
                effects: { skill: 8, stress: 8, money: 3 },
                flagsSet: ['tier3_path'],
                feedback: '你挤进了高压但高平台的三甲规培通道。',
                log: '判定成功（规培竞争）：你拿到了三甲规培席位。'
              },
              failure: {
                target: 'residency_waitlist',
                effects: { stress: 5, money: -1 },
                feedback: '竞争太激烈，你被放进候补或调剂池。',
                log: '判定失败（规培竞争）：三甲席位太少，你只能转向备选。'
              }
            }
          },
          {
            text: '去地市医院，追求稳定成长',
            check: {
              baseChance: 58,
              stats: { skill: 0.35, network: 0.25, stress: -0.1, health: 0.1 },
              minChance: 25,
              maxChance: 88,
              success: {
                target: 'drg_bootcamp',
                effects: { skill: 5, stress: 4, health: 2 },
                flagsSet: ['city_hospital_path'],
                feedback: '你顺利拿到地市医院的培养位置。',
                log: '判定成功（规培竞争）：你稳稳拿下了地市医院岗位。'
              },
              failure: {
                target: 'residency_waitlist',
                effects: { stress: 3 },
                feedback: '岗位突然缩招，你得立刻启用备选方案。',
                log: '判定失败（规培竞争）：地市医院名额缩减，你被迫转向。'
              }
            }
          },
          {
            text: '去基层先扎根社区',
            check: {
              baseChance: 68,
              stats: { ethics: 0.35, network: 0.25, stress: -0.1, health: 0.1 },
              minChance: 35,
              maxChance: 92,
              success: {
                target: 'grassroots_early',
                effects: { ethics: 6, network: 4, money: 2 },
                flagsSet: ['grassroots_path'],
                feedback: '基层岗位更看重意愿和稳定性，你顺利签下了机会。',
                log: '判定成功（规培竞争）：你拿到了基层发展机会。'
              },
              failure: {
                target: 'residency_waitlist',
                effects: { stress: 2 },
                feedback: '岗位安排临时变化，你还得再找新的落脚点。',
                log: '判定失败（规培竞争）：基层岗位也未能一步到位。'
              }
            }
          }
        ]
      },
      {
        id: 'residency_waitlist',
        stage: 'training',
        title: '候补与调剂电话',
        text: '医院人事告诉你：原方案没稳住，但还有备选位置可以接。',
        yearDelta: 0,
        options: [
          { text: '接受地市医院备选 offer', target: 'drg_bootcamp', effects: { skill: 3, stress: 2 }, flagsSet: ['city_hospital_path'] },
          { text: '先去基层积累，再伺机转回大平台', target: 'grassroots_early', effects: { ethics: 4, network: 3 }, flagsSet: ['grassroots_path'] }
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
            effects: { skill: 5, stress: 5, legalRisk: -2 },
            check: {
              baseChance: 56,
              stats: { skill: 0.55, health: 0.2, stress: -0.4, legalRisk: -0.25 },
              minChance: 22,
              maxChance: 90,
              success: {
                target: 'complex_case_turnaround',
                effects: { skill: 3, legalRisk: -2 },
                flagsSet: ['solid_records'],
                feedback: '你及时稳住了病情，复杂病例被你扛了下来。',
                log: '判定成功（夜班）：你及时处置复杂病例，避免了进一步恶化。'
              },
              failure: {
                target: 'ward_rounds',
                effects: { stress: 6, legalRisk: 4 },
                flagsSet: ['solid_records'],
                feedback: '你已经尽力，但病情变化太快，后续压力仍然压了上来。',
                log: '判定失败（夜班）：你及时赶到，但复杂病例还是给你留下了后续压力。'
              }
            }
          },
          {
            text: '先电话指导，稍后再看',
            effects: { stress: 1, skill: 1, legalRisk: 5 },
            check: {
              baseChance: 38,
              stats: { skill: 0.25, network: 0.1, stress: -0.35, legalRisk: -0.35 },
              minChance: 12,
              maxChance: 72,
              success: {
                target: 'ward_rounds',
                feedback: '电话先稳住了局面，但你知道这不是长久之计。',
                log: '判定成功（夜班）：电话指导勉强稳住局面，你险险过关。'
              },
              failure: {
                target: 'complaint_case',
                effects: { legalRisk: 7, stress: 5 },
                delayed: [{ turns: 1, effects: { legalRisk: 5, stress: 3 }, log: '病情变化后追问处理时效，你感到压力陡增。' }],
                feedback: '处置延迟被家属记住了，投诉苗头直接冒了出来。',
                log: '判定失败（夜班）：处理延迟被放大，直接引发投诉苗头。'
              }
            }
          },
          {
            text: '让同事先顶一下，自己补觉',
            target: 'ward_rounds',
            effects: { health: 3, network: -4, legalRisk: 6, ethics: -4 }
          }
        ]
      },
      {
        id: 'complex_case_turnaround',
        stage: 'resident',
        major: true,
        title: '复杂病例挺过去了',
        text: '病人暂时稳住，晨会里第一次有人认真听你复盘整个判断过程。',
        yearDelta: 0,
        options: [
          { text: '把病例整理成完整复盘，顺手请教上级', target: 'ward_rounds', effects: { skill: 3, network: 2, stress: 1 } },
          { text: '低调略过，先让自己喘口气', target: 'ward_rounds', effects: { health: 2, stress: -2 } }
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
            effects: { skill: 6, stress: 6, health: -4, legalRisk: -2 },
            check: {
              baseChance: 54,
              stats: { skill: 0.45, ethics: 0.2, health: 0.15, stress: -0.4 },
              minChance: 18,
              maxChance: 88,
              success: {
                effects: { legalRisk: -1 },
                randomTargets: [
                  { target: 'complaint_case', weight: 55 },
                  { target: 'rare_recognition', weight: 45 }
                ],
                feedback: '你把关键会诊处理住了，还可能收获难得的认可。',
                log: '判定成功（会诊）：你扛住了关键会诊，结果开始向好转动。'
              },
              failure: {
                target: 'complaint_case',
                effects: { stress: 6, legalRisk: 5 },
                feedback: '你还是没能完全兜住局面，后续争议压了过来。',
                log: '判定失败（会诊）：会诊处置留下漏洞，后续投诉风险上升。'
              }
            }
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
          {
            text: '马上复盘流程并补充沟通记录',
            effects: { legalRisk: -6, stress: 4, skill: 2 },
            check: {
              baseChance: 58,
              stats: { legalRisk: -0.5, ethics: 0.3, skill: 0.2, stress: -0.2 },
              minChance: 22,
              maxChance: 90,
              success: {
                target: 'performance_review',
                effects: { stress: -2 },
                feedback: '记录和沟通把局势稳住了，投诉没有继续升级。',
                log: '判定成功（投诉）：你靠规范记录和补沟通把风险按住了。'
              },
              failure: {
                target: 'mediation_meeting',
                effects: { legalRisk: 6, stress: 5 },
                feedback: '家属并不买账，问题被推到了更正式的协调层面。',
                log: '判定失败（投诉）：记录补得不够快，纠纷升级到了协调会。'
              }
            }
          },
          { text: '把问题全推给系统', target: 'performance_review', effects: { stress: -1, legalRisk: 8, network: -3, ethics: -4 } },
          {
            text: '请医务与法务提前介入',
            effects: { legalRisk: -4, network: 4, stress: 2 },
            flagsSet: ['legal_awareness'],
            check: {
              baseChance: 54,
              stats: { network: 0.45, legalRisk: -0.35, ethics: 0.15, stress: -0.15 },
              minChance: 20,
              maxChance: 88,
              success: {
                target: 'performance_review',
                effects: { network: 2, stress: -1 },
                feedback: '你提前把专业部门拉进来，争议被控制在可处理范围。',
                log: '判定成功（投诉）：医务与法务提前介入，局面被及时控制。'
              },
              failure: {
                target: 'mediation_meeting',
                effects: { legalRisk: 5, stress: 4 },
                feedback: '流程介入了，但情绪已经被点燃，仍要进入正式协调。',
                log: '判定失败（投诉）：即使提前请人帮忙，协调会还是没能避免。'
              }
            }
          }
        ]
      },
      {
        id: 'mediation_meeting',
        stage: 'resident',
        title: '协调会与整改单',
        text: '医务科、患者家属、带教和你坐到同一张桌前。你必须给出后续方案。',
        yearDelta: 0,
        options: [
          { text: '接受整改并补沟通、补培训', target: 'performance_review', effects: { legalRisk: -3, skill: 2, stress: 2 } },
          { text: '主动申请调整岗位，先避开高风险火线', target: 'performance_review', effects: { health: 2, money: -1, stress: -1 } }
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
        major: true,
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
        major: true,
        title: '副高与主任竞争',
        text: '名额极少。你需要平衡临床、教学、科研与团队协作。',
        yearDelta: 2,
        options: [
          {
            text: '长期打磨带教与疑难病例能力',
            effects: { skill: 8, ethics: 4, stress: 5 },
            check: {
              baseChance: 50,
              stats: { skill: 0.5, ethics: 0.25, health: 0.1, stress: -0.2, network: 0.15 },
              minChance: 20,
              maxChance: 86,
              success: {
                target: 'senior_outcome',
                effects: { skill: 3, ethics: 2 },
                flagsSet: ['chief_candidate'],
                feedback: '你的临床与带教口碑终于开始转化为晋升筹码。',
                log: '判定成功（副高竞争）：你靠硬实力拿到了继续冲刺主任的资格。'
              },
              failure: {
                target: 'promotion_setback',
                effects: { stress: 5 },
                feedback: '这轮评审没有站到你这边，你得决定下一步怎么补。',
                log: '判定失败（副高竞争）：你在这一轮竞争中失手了。'
              }
            }
          },
          {
            text: '重点经营人脉与行政沟通',
            effects: { network: 8, stress: 4, research: -1 },
            check: {
              baseChance: 46,
              stats: { network: 0.55, skill: 0.15, ethics: 0.1, legalRisk: -0.25, stress: -0.15 },
              minChance: 18,
              maxChance: 82,
              success: {
                target: 'senior_outcome',
                effects: { network: 3 },
                flagsSet: ['chief_candidate', 'admin_networking'],
                feedback: '你成功把协作与管理能力转成了晋升筹码。',
                log: '判定成功（副高竞争）：你的人脉与协调能力帮你留在了主赛道。'
              },
              failure: {
                target: 'promotion_setback',
                effects: { stress: 4, ethics: -2 },
                feedback: '人情并不能抵消全部竞争，你还是被卡在了门外。',
                log: '判定失败（副高竞争）：你的人脉经营没能换来这轮席位。'
              }
            }
          },
          {
            text: '疲惫不堪，考虑提前离开一线',
            target: 'alt_career_track',
            effects: { health: 2, stress: -5 }
          }
        ]
      },
      {
        id: 'promotion_setback',
        stage: 'senior',
        major: true,
        title: '这一轮没评上',
        text: '名单公布，没有你的名字。你还可以继续补课、换路，或暂时稳住。',
        yearDelta: 1,
        options: [
          { text: '继续补病例、补教学，等下一轮', target: 'senior_outcome', effects: { skill: 4, stress: 3 } },
          { text: '转去科研项目找突破口', target: 'research_track', effects: { research: 4, stress: 2 } },
          { text: '接受管理副职，先把位置站稳', target: 'senior_outcome', effects: { network: 4, ethics: 1, stress: 1 } }
        ]
      },
      {
        id: 'research_track',
        stage: 'senior',
        major: true,
        title: '科研与教学主线',
        text: '你主导课题、带学生、申请基金。成果与失败都被放大。',
        yearDelta: 2,
        options: [
          {
            text: '坚持规范与原创性',
            effects: { research: 9, ethics: 5, stress: 5 },
            check: {
              baseChance: 52,
              stats: { research: 0.55, ethics: 0.35, network: 0.2, stress: -0.25 },
              minChance: 20,
              maxChance: 88,
              success: {
                target: 'talent_program',
                effects: { research: 4, stress: -1 },
                flagsSet: ['clean_research'],
                feedback: '项目和文章质量都站住了脚，你迎来了更大的申报机会。',
                log: '判定成功（科研项目）：你用扎实成果换来了更高层级的机会。'
              },
              failure: {
                target: 'grant_revision',
                effects: { stress: 5 },
                feedback: '方案被认为还不够成熟，你需要回去修改再来。',
                log: '判定失败（科研项目）：项目没能一次命中，只能进入返修与补件。'
              }
            }
          },
          {
            text: '追热点、快发文',
            effects: { research: 6, stress: 4, legalRisk: 5 },
            check: {
              baseChance: 56,
              stats: { research: 0.4, network: 0.2, legalRisk: -0.4, ethics: 0.1, stress: -0.2 },
              minChance: 18,
              maxChance: 84,
              success: {
                target: 'talent_program',
                effects: { research: 3 },
                flagsSet: ['rush_research'],
                feedback: '你踩中了热点，短期成果确实上得很快。',
                log: '判定成功（科研项目）：你借着热点把履历迅速拉高。'
              },
              failure: {
                target: 'grant_revision',
                effects: { legalRisk: 4, stress: 4 },
                feedback: '热点退潮太快，方案没能撑住评审。',
                log: '判定失败（科研项目）：追热点没有换来稳定成果，反而留下了压力。'
              }
            }
          },
          { text: '转去医工交叉企业', target: 'alt_career_track', effects: { money: 8, stress: -2 } }
        ]
      },
      {
        id: 'grant_revision',
        stage: 'senior',
        title: '基金与项目返修',
        text: '评审意见写得很客气，但核心意思是：还不够。你怎么处理？',
        yearDelta: 0,
        options: [
          { text: '压缩课题范围，先保住教学和临床基本盘', target: 'senior_outcome', effects: { research: 2, stress: -1 } },
          { text: '再申一轮地区/青年项目，继续赌窗口期', target: 'talent_program', effects: { research: 3, stress: 3, money: -1 } }
        ]
      },
      {
        id: 'talent_program',
        stage: 'senior',
        major: true,
        title: '人才项目与岗位机会',
        text: '你收到了申报人才项目、重点专科或管理岗位的窗口期消息。这是少见的大机会。',
        yearDelta: 1,
        options: [
          {
            text: '申报人才项目 / 学科带头人计划',
            check: {
              baseChance: 44,
              stats: { research: 0.45, skill: 0.25, network: 0.35, ethics: 0.15, stress: -0.3, legalRisk: -0.2 },
              minChance: 15,
              maxChance: 80,
              success: {
                target: 'senior_outcome',
                effects: { research: 6, network: 5, money: 6 },
                flagsSet: ['talent_program'],
                feedback: '你抓住了稀有窗口，履历和平台一起抬升。',
                log: '判定成功（重大机会）：你拿下了人才项目/岗位机会。'
              },
              failure: {
                target: 'senior_outcome',
                effects: { stress: 4, money: -2 },
                feedback: '这次窗口没抓住，但你仍保留了继续发展的底盘。',
                log: '判定失败（重大机会）：难得窗口期擦肩而过，你只能回到长期积累。'
              }
            }
          },
          { text: '不追头衔，回归带教与临床', target: 'senior_outcome', effects: { skill: 4, ethics: 4, stress: -2 } }
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
        major: true,
        title: '转行十字路口',
        text: '你考虑药械、互联网医疗、科普博主或考公。医学背景依然是底牌。',
        yearDelta: 1,
        options: [
          {
            text: '加入药械企业做医学事务',
            check: {
              baseChance: 60,
              stats: { network: 0.3, research: 0.25, skill: 0.2, stress: -0.1 },
              minChance: 28,
              maxChance: 90,
              success: {
                target: 'ending_industry_ma',
                effects: { money: 15, stress: -8, skill: 2 },
                feedback: '面试和业务评估都通过了，你顺利切到了产业岗位。',
                log: '判定成功（转行机会）：你顺利拿到了药械企业岗位。'
              },
              failure: {
                target: 'career_retry',
                effects: { stress: 4, money: -2 },
                feedback: '机会没完全落地，你需要找过渡方案。',
                log: '判定失败（转行机会）：企业岗没有拿稳，你只能重新安排去向。'
              }
            }
          },
          {
            text: '做互联网医疗与线上管理',
            check: {
              baseChance: 52,
              stats: { network: 0.25, skill: 0.25, research: 0.15, legalRisk: -0.2, stress: -0.1 },
              minChance: 20,
              maxChance: 84,
              success: {
                target: 'ending_internet_health',
                effects: { money: 10, stress: -4, legalRisk: 4 },
                feedback: '你成功卡位线上医疗与管理方向。',
                log: '判定成功（转行机会）：你切入了互联网医疗航道。'
              },
              failure: {
                target: 'career_retry',
                effects: { stress: 3, network: 1 },
                feedback: '岗位方向不错，但公司和项目都没有完全敲定。',
                log: '判定失败（转行机会）：线上岗位没有落稳，你还得继续找路。'
              }
            }
          },
          {
            text: '备考公务员进卫健系统',
            check: {
              baseChance: 38,
              stats: { ethics: 0.25, network: 0.3, skill: 0.15, stress: -0.15 },
              minChance: 15,
              maxChance: 72,
              success: {
                target: 'ending_public_service',
                effects: { stress: -3, network: 4, ethics: 3 },
                feedback: '你成功通过了笔面试，进入公共治理路线。',
                log: '判定成功（转行机会）：你考入了卫健系统。'
              },
              failure: {
                target: 'career_retry',
                effects: { stress: 5 },
                feedback: '竞争比想象更卷，你只能先找别的落脚点。',
                log: '判定失败（转行机会）：考公失手后，你需要先稳住职业位置。'
              }
            }
          },
          { text: '回归临床再拼一把', target: 'private_track', effects: { stress: 5, skill: 3 } }
        ]
      },
      {
        id: 'career_retry',
        stage: 'senior',
        title: '转向未果后的落脚点',
        text: '风口没有稳稳接住。你需要一个能继续生活、也能留住选择权的下一站。',
        yearDelta: 0,
        options: [
          { text: '接受民营医院过渡 offer', target: 'private_track', effects: { money: 3, stress: 1 } },
          { text: '先去基层/管理岗位稳住节奏', target: 'grassroots_track', effects: { health: 2, stress: -1, ethics: 2 } }
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
        major: true,
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
            effects: { stress: 8 },
            conditions: {
              stats: { skill: { min: 70 }, research: { min: 55 }, network: { min: 60 }, legalRisk: { max: 50 }, ethics: { min: 45 } },
              flags: ['chief_candidate']
            },
            check: {
              baseChance: 35,
              stats: { skill: 0.25, research: 0.2, network: 0.35, ethics: 0.15, legalRisk: -0.45, stress: -0.2 },
              minChance: 12,
              maxChance: 72,
              success: {
                target: 'ending_department_chief',
                effects: { network: 4 },
                feedback: '你在极少数竞争中脱颖而出，终于坐上主任位置。',
                log: '判定成功（科主任竞争）：你在最终竞争中脱颖而出。'
              },
              failure: {
                target: 'ending_retire_respect',
                effects: { health: -2, stress: 4 },
                feedback: '头衔旁落，但你依然守住了专业口碑与尊重。',
                log: '判定失败（科主任竞争）：名额没有落到你头上，但你保住了声誉。'
              }
            }
          },
          {
            text: '成为科研教学骨干',
            effects: { stress: 4 },
            conditions: { stats: { research: { min: 68 }, ethics: { min: 40 }, legalRisk: { max: 60 } } },
            check: {
              baseChance: 48,
              stats: { research: 0.4, skill: 0.2, ethics: 0.2, network: 0.15, stress: -0.2 },
              minChance: 20,
              maxChance: 82,
              success: {
                target: 'ending_academic_pillar',
                feedback: '你把课题、带教和临床积累成了稳定而长线的影响力。',
                log: '判定成功（科研骨干）：你成为了学术与带教双线骨干。'
              },
              failure: {
                target: 'ending_balanced_life',
                effects: { health: 2, stress: -2 },
                feedback: '你没有继续卷进下一轮头衔竞争，转而保住了更平衡的人生。',
                log: '判定失败（科研骨干）：你没能完成最后一跳，转向了更平衡的生活。'
              }
            }
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
