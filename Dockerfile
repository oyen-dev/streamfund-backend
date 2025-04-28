# Stage 1: Dependencies
FROM node:23-alpine AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install dependencies with the preferred package manager
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Stage 2: Build
FROM node:23-alpine AS builder
WORKDIR /app

# Copy node modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application code
COPY . .

# Generate the Prisma client
RUN \
  if [ -f package-lock.json ]; then npx prisma generate; \
  elif [ -f yarn.lock ]; then yarn prisma generate; \
  elif [ -f pnpm-lock.yaml ]; then pnpm prisma generate; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the application
RUN \
  if [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Stage 3: Production runtime
FROM node:23-alpine AS runner
WORKDIR /app

# Set NODE_ENV environment variable
ENV NODE_ENV=production

# Copy package.json for potential runtime references
COPY package.json ./

# Copy Prisma files for runtime usage
COPY prisma ./prisma

# Copy the bundled code and necessary dependencies from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/node_modules/@prisma ./node_modules/@prisma

# For other production-only node_modules
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 4000

# Use the node user from the image (security best practice)
USER node

# Start the server
CMD ["node", "dist/src/main.js"]