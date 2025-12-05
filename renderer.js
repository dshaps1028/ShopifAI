const { useEffect, useState } = React;
const h = React.createElement;

const formatLog = (message) => {
  const time = new Date().toLocaleTimeString();
  return `[${time}] ${message}`;
};

const Shell = ({ children }) => h('div', { className: 'shell' }, children);

const PageTitle = ({ title, subtitle }) =>
  h(
    'div',
    { className: 'page-title' },
    h('h1', null, title),
    h('span', null, subtitle)
  );

const StatusBadge = ({ status }) =>
  h(
    'div',
    { className: 'status' },
    h('span', { className: 'dot' }),
    h('span', null, status)
  );

const Header = ({ status, label }) =>
  h(
    'header',
    null,
    h('p', { className: 'eyebrow' }, label ?? 'Status'),
    h(StatusBadge, { status })
  );

const Main = ({ children }) => h('main', null, children);

const Panel = ({ title, description, id, children }) =>
  h(
    'div',
    { className: 'panel', id },
    h('h2', null, title),
    description ? h('p', null, description) : null,
    children
  );

const ActionButton = ({ onClick, children }) =>
  h('button', { onClick }, children);

const LogText = ({ message }) => h('p', { id: 'log' }, message);

function App() {
  const [status, setStatus] = useState('Loading…');
  const [log, setLog] = useState('No actions yet.');

  useEffect(() => {
    setStatus('Ready');
    setLog(formatLog('Renderer initialized.'));
  }, []);

  const handleAction = () => {
    const response = window.electronAPI?.ping?.() ?? 'unavailable';
    setLog(formatLog(`Ping response: ${response}`));
  };

  return h(
    React.Fragment,
    null,
    h(PageTitle, {
      title: 'Merchant Workbench',
      subtitle:
        'Manage your orders, analyze your order data and learn more about Shopify all in one place'
    }),
    h(
      Shell,
      null,
      h(Header, { status, label: 'System status' }),
      h(
        Main,
        null,
        h(
          Panel,
          {
            title: 'Welcome',
            description:
              'This lightweight shell is ready for your merchant tools. Wire up APIs, drop in UI components, and iterate fast.'
          },
          h(ActionButton, { onClick: handleAction }, 'Run quick check')
        ),
        h(Panel, { title: 'Output', id: 'log-panel' }, h(LogText, { message: log }))
      )
    )
  );
}

const root = document.getElementById('root');
ReactDOM.createRoot(root).render(h(App));
