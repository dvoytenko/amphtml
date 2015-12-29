
console.log('WORKER: started!');

importScripts(
  '/dist/workers/amp-react.max.js',
  'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js'
);

console.log('WORKER: initialized?');

var data = [
  {id: 1, author: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Walke", text: "This is *another* comment"}
];

var Comment = React.createClass({
  displayName: 'Comment',
  getInitialState: function() {
    return {
      author: this.props.author
    };
  },
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  handleClick: function() {
    console.log('CLICKED!!!');
    this.setState({author: this.state.author + '.'});
  },
  render: function() {
    console.log('------ RENDERED:', this.state.author);
    return (
      React.createElement('div', {className: "comment",
          onClick: this.handleClick},
        React.createElement('h2', {className: "commentAuthor"},
            this.state.author),
        React.createElement('span', {dangerouslySetInnerHTML: this.rawMarkup()})
      )
    );
  }
});

var CommentList = React.createClass({
  displayName: 'CommentList',
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        React.createElement(Comment, {
          author: comment.author,
          key: comment.id
        }, comment.text)
      );
    });
    return (
      React.createElement('div', {className: "commentList"}, commentNodes)
    );
  }
});

var CommentBox = React.createClass({
  displayName: 'CommentBox',
  componentDidMount: function() {
    console.log('WORKER: CommentBox: componentDidMount');
  },

  render: function() {
    return (
      React.createElement('div', {className: "commentBox"},
        React.createElement('h1', {}, "Comments"),
        React.createElement(CommentList, {data: this.props.data})
      )
    );
  }
});


AMP.mount(React.createElement(CommentBox, {data: data}));
