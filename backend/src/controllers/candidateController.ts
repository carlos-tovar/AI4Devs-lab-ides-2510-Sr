import { Request, Response } from 'express';
import prisma from '../prisma';
import path from 'path';

export const createCandidate = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, address, education, workExperience } = req.body;
        const file = req.file;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: 'Missing required fields: firstName, lastName, email' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if candidate already exists
        const existingCandidate = await prisma.candidate.findUnique({
            where: { email },
        });

        if (existingCandidate) {
            return res.status(400).json({ error: 'Candidate with this email already exists' });
        }

        const newCandidate = await prisma.candidate.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                education,
                workExperience,
                cvFilePath: file ? file.path : undefined, // Use undefined instead of null for optional fields if Prisma expects it, or ensure schema allows null
            },
        });

        res.status(201).json(newCandidate);
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
