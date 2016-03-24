/**
 * Created by 111 on 16/3/3.
 */
var ToDosBox = React.createClass ({
  count: function (data) {
    var total = data.length,
      unfinished = 0;
    for (var i =0; i < data.length; i++) {
      if (data[i].completed === "false") {
        unfinished +=1;
      }
    }

    this.setState({countTotal: total, unFinishCount: unfinished});
  },

  loadData: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type:'get',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        this.count(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  setData: function (content) {
    var data = {content : content, completed: "false"};
    $.ajax({
      url : this.props.url,
      type :'post',
      dataType : 'json',
      data : data,
      success : function (newContent) {
        this.setState({data: newContent});
        this.loadData();
      }.bind(this),                                   //一定要绑定this，否则读不到this上的方法和属性
      error : function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  changeCompleted: function (newContent) {
    $.ajax({
      url : '/changeCompleted',
      type : 'post',
      dataType : 'json',
      data : newContent,
      success: function (newContent) {
        this.setState({data: newContent});
        this.loadData();
      }.bind(this),
      error : function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  deleteData: function (listId) {
    $.ajax({
      url: '/deleteData',
      type: 'post',
      dataType : 'json',
      data: {id : listId},
      success : function (newContent) {
        this.setState({data: newContent});
        this.loadData();
      }.bind(this),                                   //一定要绑定this，否则读不到this上的方法和属性
      error : function (xhr, status, err) {
        console.error('/deleteData', status, err.toString());
      }.bind(this)
    })
  },

  getInitialState: function() {
    return {data: [], countTotal: 0, unFinishCount: 0};
  },

  componentDidMount: function () {
    this.loadData();
  },

  render: function () {
    return (
      <div className='todosBox'>
        <ToDosHead />
        <InputBox onSubmitForm={this.setData}/>
        <List data={this.state.data} total={this.state.countTotal} unFinish={this.state.unFinishCount} name={this.props.name} onDelete={this.deleteData} onCompleted={this.changeCompleted}/>
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
      this.props.onSubmitForm(content);
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
  handleDelete: function (listId) {
    this.props.onDelete(listId);
  },
  handleCompleted: function (comment, obj) {
    var completed;
    switch (comment.completed) {
      case 'true':
        completed = false;
        break;
      case  'false':
        completed = true;
        break;
    }
    this.props.onCompleted({id : comment.id, completed : completed});
  },
  render: function() {
    var _this = this;                 //下面的map()方法中，如果直接用this会报错，因为this的指向不同，所以这里要先声明、引入
    var listNodes = _this.props.data.map(function(comment) {
      //var cx = React.addons.classSet;
      var completed = false;
      if (comment.completed === 'true') {
        completed = 'completed';
      }
      return (
        <li className='list'>
          <input type="checkbox" name='listChecked' checked={comment.completed} onClick={_this.handleCompleted.bind(_this, comment, this)}/>
          <span className={completed}>{comment.content}</span>
          <span className='delete-list' onClick={_this.handleDelete.bind(_this, comment.id)}>删除</span>
        </li>
      );
    });
    return (
      <ul className='list-ul'>
        {listNodes}
        <li className="inventory">unfinished: {this.props.unFinish}<span className='total'>{this.props.total} in total</span></li>
      </ul>
    );
  }
});

ReactDOM.render (
  <ToDosBox url='/data' name='Key'/>,
  document.getElementById('todo')
);
