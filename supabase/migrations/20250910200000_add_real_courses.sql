/*
  # Add Real Learning Paths

  1. New Data
    - Adds 5 comprehensive learning paths based on popular real-world courses
    - Includes detailed modules for each path
    
  2. Data Structure
    - Web Development Bootcamp
    - React Complete Guide
    - Google UX Design
    - Python Bootcamp
    - Digital Marketing Masterclass
*/

INSERT INTO public.learning_paths (id, skill, title, description, difficulty, duration, rating, students, modules)
VALUES
  (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Web Development',
    'المعسكر التدريبي الكامل لتطوير الويب 2024',
    'كن مطور ويب شامل (Full-Stack) مع دورة واحدة فقط. تغطي HTML, CSS, Javascript, Node, React, MongoDB والمزيد.',
    'beginner',
    '65 ساعة',
    4.8,
    150000,
    '[
      {"id": "m1", "type": "video", "title": "مقدمة في تطوير الويب", "duration": "45 دقيقة", "video_url": "https://www.youtube.com/embed/zJSY8tbf_ys", "completed": false},
      {"id": "m2", "type": "article", "title": "أساسيات HTML5", "duration": "15 دقيقة", "resource_url": "https://developer.mozilla.org/ar/docs/Web/HTML", "completed": false},
      {"id": "m3", "type": "project", "title": "بناء موقعك الشخصي الأول", "duration": "2 ساعة", "video_url": "https://www.youtube.com/embed/G3e-cpL7ofc", "completed": false},
      {"id": "m4", "type": "video", "title": "CSS3 وتصميم التخطيطات", "duration": "3 ساعات", "video_url": "https://www.youtube.com/embed/1Rs2ND1ryYc", "completed": false},
      {"id": "m5", "type": "quiz", "title": "اختبار الأساسيات", "duration": "30 دقيقة", "completed": false}
    ]'::jsonb
  ),
  (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'React Development',
    'React - الدليل الكامل 2024 (يتضمن Hooks, React Router, Redux)',
    'انطلق من الصفر إلى الاحتراف في React.js. تعلم بناء تطبيقات ويب حديثة وسريعة ومتجاوبة.',
    'intermediate',
    '48 ساعة',
    4.9,
    85000,
    '[
      {"id": "r1", "type": "video", "title": "لماذا React؟", "duration": "20 دقيقة", "video_url": "https://www.youtube.com/embed/Tn6-PIqc4UM", "completed": false},
      {"id": "r2", "type": "video", "title": "JavaScript Refresher", "duration": "1 ساعة", "video_url": "https://www.youtube.com/embed/M2G609501Cc", "completed": false},
      {"id": "r3", "type": "article", "title": "فهم المكونات (Components)", "duration": "25 دقيقة", "resource_url": "https://react.dev/learn", "completed": false},
      {"id": "r4", "type": "project", "title": "تطبيق قائمة المهام", "duration": "1.5 ساعة", "video_url": "https://www.youtube.com/embed/0pThnRneDjw", "completed": false},
      {"id": "r5", "type": "video", "title": "React State & Events", "duration": "2 ساعة", "video_url": "https://www.youtube.com/embed/O6P86uwfdR0", "completed": false}
    ]'::jsonb
  ),
  (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'UI/UX Design',
    'شهادة Google لتصميم تجربة المستخدم',
    'هذا هو طريقك لمهنة في تصميم تجربة المستخدم. في هذا البرنامج، ستتعلم المهارات المطلوبة التي تجعلك جاهزاً للعمل.',
    'beginner',
    '6 أشهر',
    4.8,
    210000,
    '[
      {"id": "u1", "type": "video", "title": "أساسيات تصميم تجربة المستخدم", "duration": "4 ساعات", "video_url": "https://www.youtube.com/embed/c9Wg6Cb_YlU", "completed": false},
      {"id": "u2", "type": "article", "title": "التفكير التصميمي للمبتدئين", "duration": "45 دقيقة", "resource_url": "https://www.interaction-design.org/literature/topics/design-thinking", "completed": false},
      {"id": "u3", "type": "project", "title": "إنشاء الـ Wireframes", "duration": "3 ساعات", "video_url": "https://www.youtube.com/embed/TUXg0gYyV2k", "completed": false},
      {"id": "u4", "type": "video", "title": "البحث عن المستخدمين (User Research)", "duration": "2 ساعة", "video_url": "https://www.youtube.com/embed/b-XITAdpEVM", "completed": false},
      {"id": "u5", "type": "quiz", "title": "مشروع التصميم الأول", "duration": "1 ساعة", "completed": false}
    ]'::jsonb
  ),
  (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Python Programming',
    '100 يوم من الكود: المعسكر الاحترافي لبرمجة بايثون',
    'أتقن لغة بايثون من خلال بناء 100 مشروع في 100 يوم. تعلم علوم البيانات، الأتمتة، بناء المواقع والألعاب.',
    'beginner',
    '60 ساعة',
    4.7,
    195000,
    '[
      {"id": "p1", "type": "video", "title": "يوم 1: المتغيرات والبيانات", "duration": "1 ساعة", "video_url": "https://www.youtube.com/embed/_uQrJ0TkZlc", "completed": false},
      {"id": "p2", "type": "project", "title": "يوم 2: حاسبة البقشيش", "duration": "45 دقيقة", "video_url": "https://www.youtube.com/embed/m9n2f9lhtrw", "completed": false},
      {"id": "p3", "type": "video", "title": "يوم 3: التحكم في التدفق والعمليات المنطقية", "duration": "1 ساعة", "video_url": "https://www.youtube.com/embed/41qGDWDNgKE", "completed": false},
      {"id": "p4", "type": "quiz", "title": "اختبار بايثون الأساسي", "duration": "20 دقيقة", "completed": false},
      {"id": "p5", "type": "project", "title": "مشروع اللعبة النصية", "duration": "2 ساعة", "video_url": "https://www.youtube.com/embed/rfscVS0vtbw", "completed": false}
    ]'::jsonb
  ),
  (
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Digital Marketing',
    'دورة التسويق الرقمي الشاملة - 12 دورة في 1',
    'أتقن التسويق الرقمي الاستراتيجي، ووسائل التواصل الاجتماعي، وSEO، وYouTube، والبريد الإلكتروني، والمزيد!',
    'beginner',
    '22 ساعة',
    4.6,
    120000,
    '[
      {"id": "d1", "type": "article", "title": "مقدمة في التسويق الرقمي", "duration": "30 دقيقة", "completed": false},
      {"id": "d2", "type": "video", "title": "أساسيات التسويق عبر المحتوى", "duration": "1 ساعة", "completed": false},
      {"id": "d3", "type": "video", "title": "إعلانات الفيسبوك وانستجرام", "duration": "2 ساعة", "completed": false},
      {"id": "d4", "type": "project", "title": "خطة تسويقية لمنتج", "duration": "2 ساعة", "completed": false},
      {"id": "d5", "type": "quiz", "title": "اختبار استراتيجيات التسويق", "duration": "30 دقيقة", "completed": false}
    ]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;
