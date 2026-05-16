import React from 'react'

const Footer = () => (
    <footer className="bg-bg border-t border-border py-8 px-10 text-center">
        <p className="font-mono text-xs text-text-subtle tracking-wider">
            © {new Date().getFullYear()} Niloy Rudra · Full-Stack Engineer (Node.js · React · React Native · AI/NLP) · Dhaka, Bangladesh
        </p>
    </footer>
);

export default Footer;