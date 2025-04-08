
const ChatInterface = () => {
  const messages = [
    {
      id: 1,
      sender: 'Dinesh',
      profileImg: '/api/placeholder/60/60',
      text: 'Lorem ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been',
      isNew: true
    },
    {
      id: 2,
      sender: 'Dinesh',
      profileImg: '/api/placeholder/60/60',
      text: 'Lorem ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been',
      isNew: true
    },
    {
      id: 3,
      sender: 'Dinesh',
      profileImg: '/api/placeholder/60/60',
      text: 'Lorem ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since/Lorem Ipsum Has Been',
      isNew: false
    }
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto border border-gray-200 shadow-sm">
        {messages.map((message) => (
          <div key={message.id} className="p-4 border-b border-gray-100 flex">
            <div className="flex-shrink-0 mr-4">
              <img 
                src={message.profileImg} 
                alt={`${message.sender}'s profile`} 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <h3 className="font-medium mr-2">{message.sender}</h3>
                {message.isNew && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                    new
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatInterface;