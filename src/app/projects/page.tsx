import fs from 'fs';
import path from 'path';
import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: 'Clean Energy Installations Portfolio | GES Sri Lanka',
  description: 'Explore our completed solar energy installations across Sri Lanka. Browse through high-quality photos of our residential, commercial, and utility-scale projects.',
};

export default async function ProjectsPage() {
  const installationsDir = path.join(process.cwd(), 'public/1. Installations');
  
  const projects: Array<{
    name: string;
    folderName: string;
    images: string[];
  }> = [];

  if (fs.existsSync(installationsDir)) {
    const folders = fs.readdirSync(installationsDir);
    for (const folder of folders) {
      const folderPath = path.join(installationsDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath);
        const images = files
          .filter(file => file.toLowerCase().endsWith('.webp'))
          .map(file => `/1. Installations/${folder}/${file}`);
        
        if (images.length > 0) {
          // Format project name for high-end presentation:
          // e.g., Mr. Rohan Liyanaarachchi_Kelaniya -> Mr. Rohan Liyanaarachchi, Kelaniya
          // Mr. Prasad - Kelaniya - 6kW Installation -> Mr. Prasad (Kelaniya, 6kW)
          let cleanName = folder;
          
          // Try to split by underscore or dash for Client / Location
          if (folder.includes('_')) {
            const parts = folder.split('_');
            const client = parts[0].trim();
            const location = parts[1].trim();
            cleanName = location ? `${client} — ${location}` : client;
          } else if (folder.includes(' - ')) {
            const parts = folder.split(' - ');
            const client = parts[0].trim();
            const details = parts.slice(1).map(p => p.trim()).filter(p => !p.toLowerCase().includes('installation')).join(', ');
            cleanName = details ? `${client} (${details})` : client;
          }

          // Clean up multiple spaces
          cleanName = cleanName.replace(/\s+/g, ' ').trim();

          projects.push({
            name: cleanName,
            folderName: folder,
            images: images,
          });
        }
      }
    }
  }

  // Sort projects alphabetically
  projects.sort((a, b) => a.name.localeCompare(b.name));

  return <ProjectsClient projects={projects} />;
}
