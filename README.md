# Super Sticky Notes 📝

A decentralized sticky notes app built with XMTP and OnchainKit. Send private, colorful sticky notes to any wallet address!

## Features

- 🎨 Create colorful sticky notes
- 🔒 Private messaging using XMTP
- 🎯 Drag and position notes anywhere
- 💾 Persistent note positions and colors
- 👛 Easy wallet connection with OnchainKit
- 📱 Mobile-friendly design

## Tech Stack

- Next.js 14 (App Router)
- OnchainKit for wallet integration
- XMTP for private messaging
- TailwindCSS for styling
- TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/onchaincommerce/super-sticky-notes.git
cd super-sticky-notes
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `dev` branch for development
- Create feature branches from `dev`
- Submit PRs to `dev` for review
- Production deployments merge from `dev` to `main`

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_PROJECT_ID=your_wallet_connect_project_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details
