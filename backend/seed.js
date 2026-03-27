import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import { mockUsers, mockProjects } from './mockData.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB!');

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Project.deleteMany({});

        console.log('Inserting users...');
        // We must map mockUsers to remove the string _id so Mongoose auto-generates ObjectIds
        const usersToInsert = mockUsers.map(({ _id, ...rest }) => rest);
        const insertedUsers = await User.insertMany(usersToInsert);
        console.log(`Inserted ${insertedUsers.length} users.`);

        // Find the client user 'techcorp' (which represents dummy client '2' in mockData) to assign projects
        const clientUser = insertedUsers.find(u => u.username === 'techcorp');
        
        // Also map some freelancers if needed, though mostly projects just need a client
        const freelancerUser = insertedUsers.find(u => u.username === 'marcusw');

        if (!clientUser) throw new Error('Client user not found');

        console.log('Inserting projects...');
        const projectsToInsert = mockProjects.map(p => {
            const { _id, client, assignedTo, proposals, ...rest } = p;
            
            const projectToSave = {
                ...rest,
                client: clientUser._id, // Assign to the valid client ObjectId
            };

            if (assignedTo && freelancerUser) {
                projectToSave.assignedTo = freelancerUser._id;
            }

            return projectToSave;
        });

        const insertedProjects = await Project.insertMany(projectsToInsert);
        console.log(`Inserted ${insertedProjects.length} projects.`);

        console.log('Database seeded successfully! You can now browse projects.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
