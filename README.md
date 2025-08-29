# 🌍 CHEDCOM NGO Website  

The official website and admin dashboard for **CHEDCOM**, a non-governmental organization focused on community development, training, and social impact.  

This project includes:  
- A **public-facing website** (Landing, About, Team, Projects, Trainings, Blog, Gallery, Contact).  
- A secure **admin dashboard** with role-based access for managing site content.  

---

## 🚀 Tech Stack  

- **Framework:** [Next.js 13+ (App Router)](https://nextjs.org/)  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/)  
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (with JWT strategy + bcrypt)  
- **Media Uploads:** [ReImage](https://reimage.io/) for image hosting  
- **Deployment:** [Vercel](https://vercel.com/)  

---

## ✅ Features (MVP)  

### Admin Dashboard  
- Secure login with **NextAuth.js**.  
- Role-based access: **Superadmins** vs **Admins**.  
- Middleware protection for `/admin/*` routes.  
- **CRUD Modules Completed**:  
  - **Blog** → Create and manage posts.  
  - **Projects** → Manage project details (title, desc, collaborators, dates, ongoing flag, image).  
  - **Trainings** → Full schema (facilitators, target audience, resources, cert flag, mode, dates).  
  - **Gallery** → Uploads via ReImage, media stored in MongoDB, pagination included.  
- **Manage Admins** → Superadmins can create, edit, and delete other admin accounts.  

### Public Website (In Progress)  
- Landing page (replace boilerplate).  
- About page.  
- Team page.  
- Projects page (pulls from DB).  
- Trainings page (pulls from DB).  
- Blog (list + single post).  
- Gallery (paginated, optimized images).  
- Contact page.  

---

## 🔐 Admin Roles  

- **Superadmin**  
  - Can manage other admins.  
  - Full CRUD on all modules.  

- **Admin**  
  - Can manage Blog, Projects, Trainings, Gallery.  
  - Cannot manage other admins.  

---

## 📜 License  

This project is built for CHEDCOM NGO. All rights reserved.  
