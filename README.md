# Case Study

This project is built using [Next.js](https://nextjs.org/), initiated with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Preparation Steps

Ensure you have installed all necessary tools and configurations before diving in:

- Node.js, specifically version 18.17.0 or above
- Your preferred package manager such as `npm`, `yarn`, `pnpm`, or `bun`
- A `.env.local` file set up with the following entry:
  - `NEXT_PUBLIC_PROJECT_ID=your_project_id_here`

## Launching the Project

Kickstart the development server with one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Environment Setup

Follow these guidelines to integrate WalletConnect Cloud and set your environment variables accordingly:

- Visit [`WalletConnect Cloud`](https://cloud.walletconnect.com/app) to either sign up or log in.
- Opt to "Create" a new project from your dashboard.
- Fill in your project details, aligning the name with your Next.js Web3 application.
- Post-creation, locate your `Project ID` within the project's dashboard.
- Rename the `.env.local.example` file to `.env.local`.
- Embed your `Project ID` into the newly renamed `.env.local` file as shown:
  - `NEXT_PUBLIC_PROJECT_ID=your_project_id_here`
- Ensure `your_project_id_here` is replaced with the actual `Project ID`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
