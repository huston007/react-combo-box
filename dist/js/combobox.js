/** @jsx React.DOM */

//wrap component to provide possibility to use with different module systems
(function(definition) {
    "use strict";

    if (typeof exports === 'object') {
        module.exports = definition(); // CommonJS
    }
    else if (typeof define === 'function' && define.amd) {
        define([], definition); // AMD
    }
    else {
        window.ReactComboBox = {    // Browser
            ComboBox : definition()
        };
    }
})(function() {
    "use strict";
/** @jsx React.DOM */

var DropDownItem = React.createClass({displayName: 'DropDownItem',
    render: function() {

        return (
            React.DOM.div(null, 
                this.props.item
            )
        );
    }
});

/** @jsx React.DOM */

var DropDownList = React.createClass({displayName: 'DropDownList',
    render: function() {
        this.props.items = this.props.items || [];

        var listItems = this.props.items.map(function (item) {
            var itemElement =  React.addons.cloneWithProps(this.props.itemBlock, {
                item: item,
            });
            return React.DOM.div({className: "dropdown-item"}, itemElement);
        }.bind(this));

        var displayMode = this.props.show ? "block" : "none";

        return (
                React.DOM.div({className: "reactcombobox__dropdown", style: {display: displayMode}}, 
                    listItems
                )
            );
    }
});

/** @jsx React.DOM */

var ComboBox = React.createClass({displayName: 'ComboBox',
    propTypes: {
        //array of predefined options
        options: React.PropTypes.array,
        //or datasource function. Can return a promise. Input value and calback will pass into function
        source: React.PropTypes.func,
        //custom item component, also can be passed as child of ComboBox
        cutomItem: React.PropTypes.component
    },
    getInitialState: function() {
        return {
            isOpened: false
        };
    },
    componentDidMount: function(){
        if (!this.props.options){
            this.retrieveDataFromDataSource();
        }
    },
    render: function() {

        var classes = React.addons.classSet({
            'reactcombobox__arrow': true,
            'reactcombobox__arrow_up': this.state.isOpened,
            'reactcombobox__arrow_down': !this.state.isOpened
        });

        //support custom drop down item
        var itemBlock = this.props.children || this.props.cutomItem || DropDownItem(null);

        return (
            React.DOM.div({className: "reactcombobox"}, 
                React.DOM.div({className: "reactcombobox__input-wrap"}, 
                    React.DOM.a({className: classes, onClick: this.handleArrowClick, tabIndex: "-1"}), 
                    React.DOM.input({type: "text", className: "reactcombobox__input", ref: "textInput", value: this.props.value, 
                        onFocus: this.openDropDown, onBlur: this.closeDropDown, onChange: this.handleInputChange})
                ), 

                DropDownList({items: this.state.filteredOptions ||this.props.options, show: this.state.isOpened, itemBlock: itemBlock})
            )
        );
    },
    retrieveDataFromDataSource: function(inputValue){

        var onLoaded = function(newOptions){
            this.setProps({
                options: newOptions
            });
        }.bind(this);

        var probablyPromise = this.props.source(inputValue, onLoaded);

        if (probablyPromise && probablyPromise.then){
            probablyPromise.then(onLoaded);
        }
    },
    handleInputChange: function(event){
        this.setProps({value: event.target.value});
        this.filterItems(event.target.value);
    },
    filterItems: function(query){
        if (this.props.source){
            this.retrieveDataFromDataSource(query);
        } else {
            var allOptions = this.props.options;
            var filteredOptions = [];

            for (var i = 0, len = allOptions.length; i<len; i++){
                var option = allOptions[i];

                if (option.indexOf(query) !== -1){
                    filteredOptions.push(option);
                }
            }
            this.setState({filteredOptions: filteredOptions});
        }
    },
    handleArrowClick: function(){
        if (!this.state.isOpened){
            this.openDropDown();
            this.refs.textInput.getDOMNode().focus();
            return false;
        } else {
            this.closeDropDown();
            this.refs.textInput.getDOMNode().blur();
        }
    },
    openDropDown: function(){
        this.setState({isOpened: true});
    },
    closeDropDown: function(){
        this.setState({isOpened: false});
    },
});



    return ComboBox;
});