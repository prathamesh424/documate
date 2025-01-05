import Editor from '@/components/notepad/Editor';
import React from 'react';

const page = () => {
    return (
        <div className='bg-white min-h-screen'>
            <h1>Welcome to notepad</h1>
            <Editor/>
        </div>
    );
};

export default page;