FROM node:18-alpine

WORKDIR /app

# -----------------------------
# 1️⃣ Install dependencies
# -----------------------------
COPY package.json package-lock.json ./
RUN npm ci

# -----------------------------
# 2️⃣ Build-time PUBLIC env vars (Clerk)
# -----------------------------
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_FRONTEND_API

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_FRONTEND_API=$NEXT_PUBLIC_CLERK_FRONTEND_API

# -----------------------------
# 3️⃣ Copy source and build
# -----------------------------
COPY . .
RUN npm run build

# -----------------------------
# 4️⃣ Runtime
# -----------------------------
EXPOSE 3000
CMD ["npm", "start"]
