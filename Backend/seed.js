// seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/Admin');
const Project = require('./models/Project');
const ImpactStory = require('./models/ImpactStory');
const FundCollection = require('./models/FundCollection');
const FundUsage = require('./models/FundUsage');
const CommitteeMember = require('./models/CommitteeMember');
const Activity = require('./models/Activity');
const Gallery = require('./models/Gallery');

const seed = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create or Find Admin
    let admin = await Admin.findOne({ email: 'admin@nekkaam.org' });
    if (!admin) {
      console.log('Creating default admin...');
      admin = await Admin.create({
        name: 'Nek Kaam Admin',
        email: 'admin@nekkaam.org',
        password: 'admin123', // Will be hashed by pre-save middleware
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin created (email: admin@nekkaam.org, password: admin123)');
    } else {
      console.log('✅ Admin already exists');
    }

    // Clear existing data to avoid duplicates (optional but good for clean state)
    await Project.deleteMany({});
    await ImpactStory.deleteMany({});
    await FundCollection.deleteMany({});
    await FundUsage.deleteMany({});
    await CommitteeMember.deleteMany({});
    await Activity.deleteMany({});
    await Gallery.deleteMany({});
    console.log('Cleared existing projects, stories, funds, committee members, activities, and gallery...');

    // 2. Seed Projects
    console.log('Seeding projects...');
    const projects = await Project.create([
      {
        title: 'Water Hand Pump Installation - Phase 1',
        objective: 'Provide clean drinking water to underprivileged families',
        description: 'Bored and installed a heavy-duty hand pump to ensure reliable clean water for over 150 local residents.',
        budget: 12000,
        location: 'Patna, Bihar',
        status: 'Completed',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-10'),
        addedBy: admin._id,
        completionReport: 'The hand pump was successfully installed and tested. The water quality was verified safe for drinking.'
      },
      {
        title: 'Water Hand Pump Installation - Phase 2',
        objective: 'Provide clean drinking water in adjacent village ward',
        description: 'Installed a second deep bore hand pump due to high demand and water scarcity in the neighboring ward.',
        budget: 15000,
        location: 'Gaya, Bihar',
        status: 'Completed',
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-15'),
        addedBy: admin._id,
        completionReport: 'Deep boring completed and hand pump installed. Currently fully operational and serving 200+ villagers.'
      },
      {
        title: 'Karbala Wall and Maintenance Support',
        objective: 'Repair and secure the Karbala ground boundary wall',
        description: 'Constructed and repaired the boundary wall of the local Karbala ground to ensure security and prevent encroachment.',
        budget: 20000,
        location: 'Nalanda, Bihar',
        status: 'Completed',
        startDate: new Date('2024-05-10'),
        endDate: new Date('2024-05-25'),
        addedBy: admin._id,
        completionReport: 'Boundary wall completed successfully and painted. Gate secured.'
      },
      {
        title: 'Eid Gah Renovation & Cleaning Drive',
        objective: 'Renovate and clean the Eid prayer ground',
        description: 'Renovated the prayer field, repaired the Mihrab, and performed a complete cleaning drive for the community Eid prayers.',
        budget: 25000,
        location: 'Bihar Sharif, Bihar',
        status: 'Completed',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-12'),
        addedBy: admin._id,
        completionReport: 'All repairs completed in time. More than 1000 people offered Eid prayers comfortably.'
      },
      {
        title: 'Community Freezer & Refrigerator Installation',
        objective: 'Provide cold storage for food/meat distribution',
        description: 'Procuring and installing commercial-grade freezers/refrigerators for storing and distributing meat and perishables to needy families.',
        budget: 35000,
        location: 'Muzaffarpur, Bihar',
        status: 'Ongoing',
        startDate: new Date('2024-06-01'),
        addedBy: admin._id
      }
    ]);
    console.log(`✅ Seeded ${projects.length} projects`);

    // 3. Seed Impact Stories
    console.log('Seeding impact stories...');
    const stories = await ImpactStory.create([
      {
        title: 'Clean Water Changes Zahid\'s Family Life',
        personName: 'Zahid Ansari',
        story: 'For years, my family had to fetch drinking water from a dirty canal or walk over a kilometer to get clean water. After Nek Kaam Foundation installed the water hand pump in our ward, our life has changed. We have clean water right outside our house. My children no longer fall sick from water-borne diseases.',
        location: 'Patna, Bihar',
        date: new Date('2024-03-12'),
        images: [{ url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=600' }],
        addedBy: admin._id,
        isApproved: true
      },
      {
        title: 'Eid Prayers in a Beautiful & Clean Eid Gah',
        personName: 'Maulana Aslam',
        story: 'Our Eid Gah was in very bad shape with broken walls and debris. Nek Kaam Foundation stepped in and did a complete renovation. The community was overjoyed to see the clean, beautiful prayer ground on Eid morning. We thank all the members of the foundation for their contribution.',
        location: 'Bihar Sharif, Bihar',
        date: new Date('2024-06-15'),
        images: [{ url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600' }],
        addedBy: admin._id,
        isApproved: true
      }
    ]);
    console.log(`✅ Seeded ${stories.length} impact stories`);

    // 4. Seed Fund Collections
    console.log('Seeding fund collections...');
    const collections = await FundCollection.create([
      {
        amount: 150000,
        source: 'Annual Member Contributions & Subscriptions',
        date: new Date('2024-01-10'),
        notes: 'Monthly and annual subscription collections from foundation members',
        addedBy: admin._id
      },
      {
        amount: 80000,
        source: 'Zakat & Sadaqah Fund Drive',
        date: new Date('2024-03-05'),
        notes: 'Special charity drive for community projects',
        addedBy: admin._id
      },
      {
        amount: 50000,
        source: 'General Public Donations',
        date: new Date('2024-05-01'),
        notes: 'Voluntary donations received for water pump projects',
        addedBy: admin._id
      }
    ]);
    console.log(`✅ Seeded ${collections.length} fund collections`);

    // 5. Seed Fund Usages
    console.log('Seeding fund usages...');
    const usages = await FundUsage.create([
      {
        title: 'Water Hand Pump - Phase 1',
        category: 'Water Pump Installation',
        amountUsed: 12000,
        purpose: 'Boring and installation of hand pump',
        location: 'Patna, Bihar',
        beneficiary: '150 Residents of Ward 4',
        description: 'Complete boring, hand pump unit, concrete platform construction and pipe fittings.',
        date: new Date('2024-03-10'),
        addedBy: admin._id
      },
      {
        title: 'Water Hand Pump - Phase 2',
        category: 'Water Pump Installation',
        amountUsed: 15000,
        purpose: 'Boring and installation of second hand pump',
        location: 'Gaya, Bihar',
        beneficiary: '200 Residents of Village Ward',
        description: 'Deep bore water hand pump installation due to hard soil terrain.',
        date: new Date('2024-04-15'),
        addedBy: admin._id
      },
      {
        title: 'Karbala Ground Boundary Wall Repair',
        category: 'Other',
        amountUsed: 20000,
        purpose: 'Secure Karbala boundary wall',
        location: 'Nalanda, Bihar',
        beneficiary: 'Local Muslim Community',
        description: 'Bricks, cement, labor costs for building the missing boundary wall segments.',
        date: new Date('2024-05-25'),
        addedBy: admin._id
      },
      {
        title: 'Eid Gah Cleaning & Renovation',
        category: 'Schools Support',
        amountUsed: 25000,
        purpose: 'Renovation of Mihrab and ground leveling',
        location: 'Bihar Sharif, Bihar',
        beneficiary: '1000+ Eid Worshippers',
        description: 'Leveling the ground, painting the main structure, and organizing cleaning equipment.',
        date: new Date('2024-06-12'),
        addedBy: admin._id
      }
    ]);
    console.log(`✅ Seeded ${usages.length} fund usages`);

    // 6. Seed Committee Members
    console.log('Seeding committee members...');
    const committee = await CommitteeMember.create([
      {
        name: 'Mohammed Rafiq Ahmed',
        designation: 'President',
        phoneNumber: '9876543210',
        email: 'rafiq@nekkaam.org',
        address: 'Patna, Bihar',
        bio: 'Founder and President of Nek Kaam Foundation. Dedicated to serving society for over 15 years.',
        order: 1,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      },
      {
        name: 'Abdul Wahid Khan',
        designation: 'Vice President',
        phoneNumber: '9876543211',
        email: 'wahid@nekkaam.org',
        address: 'Gaya, Bihar',
        bio: 'Co-founder and Vice President. Passionate about rural development and clean water initiatives.',
        order: 2,
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
      },
      {
        name: 'Mohammed Iqbal Ansari',
        designation: 'Secretary',
        phoneNumber: '9876543212',
        email: 'iqbal@nekkaam.org',
        address: 'Nalanda, Bihar',
        bio: 'Coordinates all operations, documentation, and manages foundation communications.',
        order: 3,
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
      },
      {
        name: 'Khalid Hussain Siddiqui',
        designation: 'Treasurer',
        phoneNumber: '9876543213',
        email: 'khalid@nekkaam.org',
        address: 'Muzaffarpur, Bihar',
        bio: 'Chartered Accountant. Manages accounts and ensures 100% transparent audits.',
        order: 4,
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'
      }
    ]);
    console.log(`✅ Seeded ${committee.length} committee members`);

    // 7. Seed Activities
    console.log('Seeding activities...');
    const activities = await Activity.create([
      {
        title: 'Installed Water Pump in Patna Ward 4',
        description: 'Successfully completed the water pump installation project providing fresh water to the local families.',
        location: 'Patna, Bihar',
        date: new Date('2024-03-10'),
        addedBy: admin._id,
        category: 'Water Pump Installation',
        isFeatured: true
      },
      {
        title: 'Gaya Village Water Pump Operational',
        description: 'Installed second water pump to relieve water scarcity issues in rural Gaya.',
        location: 'Gaya, Bihar',
        date: new Date('2024-04-15'),
        addedBy: admin._id,
        category: 'Water Pump Installation',
        isFeatured: true
      },
      {
        title: 'Karbala Ground Maintenance Completed',
        description: 'Constructed boundary wall and restored security to the local Karbala ground.',
        location: 'Nalanda, Bihar',
        date: new Date('2024-05-25'),
        addedBy: admin._id,
        category: 'Other',
        isFeatured: true
      },
      {
        title: 'Eid Gah Cleaning & Renovation Campaign',
        description: 'Volunteer campaign completed successfully. More than 1000 residents prayed together on Eid.',
        location: 'Bihar Sharif, Bihar',
        date: new Date('2024-06-12'),
        addedBy: admin._id,
        category: 'Schools Support',
        isFeatured: true
      }
    ]);
    console.log(`✅ Seeded ${activities.length} activities`);

    // 8. Seed Gallery
    console.log('Seeding gallery...');
    const galleryItems = await Gallery.create([
      {
        title: 'Hand Pump Phase 1 Inauguration',
        category: 'Water Projects',
        image: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&q=80&w=600',
        addedBy: admin._id
      },
      {
        title: 'Karbala Boundary Wall Construction',
        category: 'Community Activities',
        image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600',
        addedBy: admin._id
      },
      {
        title: 'Eid Gah Renovation Complete',
        category: 'Schools Projects',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
        addedBy: admin._id
      }
    ]);
    console.log(`✅ Seeded ${galleryItems.length} gallery items`);

    console.log('All data seeded successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
