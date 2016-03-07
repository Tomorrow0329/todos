/**
 * Created by 111 on 16/3/3.
 */
var ToDosBox = React.createClass ({
  loadData: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type:'get',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  updateValue: function (content) {
    $.ajax({
      url : this.props.url,
      type :'post',
      dataType : 'json',
      data : content,
      success : function (newContent) {
        this.setState({data: newContent});
        this.loadData();
      }.bind(this),                                   //一定要绑定this，否则读不到this上的方法和属性
      error : function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function () {
    this.loadData();
  },

  render: function () {
    return (
      <div className='todosBox'>
        <ToDosHead />
        <InputBox onSubmitForm={this.updateValue}/>
        <List data={this.state.data} name={this.props.name}/>
      </div>
    )
  }
});

var ToDosHead = React.createClass ({
  render: function (){
    return (
     <h1 className='header'>ToDos</h1>
    )
  }
});

var InputBox = React.createClass ({
  getInitialState: function () {
    return ({value : ''});
  },
  handleInputChange: function (e) {
    this.setState({value : e.target.value});
  },
  handleSubmit: function (e) {

    e.preventDefault();

    var content = this.state.value.trim();
    if (content && content !== "") {
      this.setState({value : ''});
      this.props.onSubmitForm({content : content});
    }
  },
  render: function () {
    return (
      <form className='input-box' onSubmit={this.handleSubmit}>
        <input
          className='input' type='text'
          value={this.state.value}
          placeholder='What needs to be done ?'
          onChange={this.handleInputChange}/>
        <input className='submit' type='submit' value='Add'/>
      </form>
    )
  }
});

var List = React.createClass ({
  render: function() {
    var listNodes = this.props.data.map(function(comment) { //这里要用map()方法读取props中的数据，否则会报错，，原因：不详！！！（有待研究）
      return (
        <li className='list'>
          {comment.content}
        </li>
      );
    });
    return (
      <ul className='list-ul'>
        {listNodes}
      </ul>
    );
  }
});

ReactDOM.render (
  <ToDosBox url='/data' name='Key'/>,
  document.getElementById('todo')
);
