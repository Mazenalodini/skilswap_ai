import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('❌ Missing Supabase credentials in .env file.');
    process.exit(1);
}

const supabase = createClient(url, key);

const sampleUsers = [
    {
        email: 'ahmed@example.com',
        name: 'أحمد محمد',
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'مطور ويب متخصص في React و Node.js مع خبرة 5 سنوات',
        location: 'الرياض، السعودية',
        points: 2500,
        reputation: 4.8,
        level: 'expert',
        status: 'online',
        completed_services: 45,
        social_links: {
            linkedin: 'https://linkedin.com/in/ahmed',
            github: 'https://github.com/ahmed'
        }
    },
    {
        email: 'fatima@example.com',
        name: 'فاطمة علي',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        bio: 'مصممة UI/UX مبدعة متخصصة في تصميم التطبيقات الجوالة',
        location: 'دبي، الإمارات',
        points: 1800,
        reputation: 4.9,
        level: 'advanced',
        status: 'available',
        completed_services: 32
    }
];

const sampleServices = [
    {
        title: 'تطوير موقع إلكتروني متجاوب',
        description: 'سأقوم بتطوير موقع إلكتروني احترافي ومتجاوب باستخدام أحدث التقنيات',
        category: 'Web Development',
        skill_required: 'React',
        skill_level: 'intermediate',
        points: 500,
        estimated_time: '5-7 أيام',
        status: 'available',
        tags: ['React', 'TypeScript', 'Tailwind CSS'],
        requirements: ['تفاصيل المشروع', 'المحتوى والصور']
    },
    {
        title: 'تصميم واجهة تطبيق جوال',
        description: 'تصميم واجهة مستخدم عصرية وسهلة الاستخدام لتطبيقات الجوال',
        category: 'UI/UX Design',
        skill_required: 'Figma',
        skill_level: 'advanced',
        points: 350,
        estimated_time: '3-5 أيام',
        status: 'available',
        tags: ['Figma', 'UI Design', 'Mobile App'],
        requirements: ['فكرة التطبيق', 'الألوان المفضلة']
    }
];

const sampleLearningPaths = [
    {
        skill: 'React',
        title: 'تعلم React من الصفر إلى الاحتراف',
        description: 'مسار شامل لتعلم مكتبة React وبناء تطبيقات ويب تفاعلية',
        difficulty: 'beginner',
        duration: '6 أسابيع',
        rating: 4.7,
        students: 1250,
        modules: [
            {
                id: crypto.randomUUID(),
                title: 'مقدمة في React',
                type: 'video',
                duration: '45 دقيقة'
            },
            {
                id: crypto.randomUUID(),
                title: 'المكونات والخصائص',
                type: 'video',
                duration: '60 دقيقة'
            },
            {
                id: crypto.randomUUID(),
                title: 'إدارة الحالة مع useState',
                type: 'article',
                duration: '30 دقيقة'
            },
            {
                id: crypto.randomUUID(),
                title: 'مشروع عملي: تطبيق المهام',
                type: 'project',
                duration: '2 ساعة'
            }
        ]
    },
    {
        skill: 'UI/UX Design',
        title: 'أساسيات تصميم واجهات المستخدم',
        description: 'تعلم مبادئ التصميم وكيفية إنشاء واجهات جذابة وسهلة الاستخدام',
        difficulty: 'beginner',
        duration: '4 أسابيع',
        rating: 4.6,
        students: 890,
        modules: [
            {
                id: crypto.randomUUID(),
                title: 'مبادئ التصميم الأساسية',
                type: 'video',
                duration: '40 دقيقة'
            },
            {
                id: crypto.randomUUID(),
                title: 'نظرية الألوان',
                type: 'article',
                duration: '25 دقيقة'
            },
            {
                id: crypto.randomUUID(),
                title: 'التايبوغرافي والخطوط',
                type: 'video',
                duration: '35 دقيقة'
            }
        ]
    }
];

async function seedData() {
    console.log('🌱 Starting database seeding...');

    // 1. Insert Users
    console.log('Creating users...');
    const createdUsers = [];
    for (const user of sampleUsers) {
        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

        if (existingUser) {
            console.log(`User ${user.email} already exists.`);
            createdUsers.push({ ...user, id: existingUser.id });
        } else {
            const { data, error } = await supabase
                .from('users')
                .insert([user])
                .select()
                .single();

            if (error) {
                console.error(`Error creating user ${user.email}:`, error.message);
            } else {
                console.log(`User ${user.email} created.`);
                createdUsers.push(data);
            }
        }
    }

    if (createdUsers.length === 0) {
        console.error('❌ No users created/found. Aborting.');
        return;
    }

    // 2. Insert Services
    console.log('Creating services...');
    for (let i = 0; i < sampleServices.length; i++) {
        const service = sampleServices[i];
        const provider = createdUsers[i % createdUsers.length]; // Distribute services among users

        const { error } = await supabase
            .from('services')
            .insert([{ ...service, provider_id: provider.id }]);

        if (error) {
            console.error(`Error creating service "${service.title}":`, error.message);
        } else {
            console.log(`Service "${service.title}" created.`);
        }
    }

    // 3. Insert Learning Paths
    console.log('Creating learning paths...');
    for (const path of sampleLearningPaths) {
        const { error } = await supabase
            .from('learning_paths')
            .insert([path]);

        if (error) {
            console.error(`Error creating learning path "${path.title}":`, error.message);
        } else {
            console.log(`Learning path "${path.title}" created.`);
        }
    }

    console.log('✅ Database seeding completed!');
}

seedData().catch(console.error);
