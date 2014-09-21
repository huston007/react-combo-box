/** @jsx React.DOM */

var ComboBox = React.createClass({
    mixins: [EventHandlersMixin, OptionsHelperMixin],
    propTypes: {
        //array of predefined options
        options: React.PropTypes.array,
        //or datasource function. Can return a promise. Input value and callback will be passed into source function
        source: React.PropTypes.func,
        //if options is array of objects, this param describe what field of object should combobox display into dropdown list
        titleField: React.PropTypes.string,
        //item and input value will be passed into onChange function
        onChange: React.PropTypes.func,
        //custom item component, also can be passed as child of ComboBox
        cutomItem: React.PropTypes.component,
        //disable or enable combobox by changing "disabled" attribute
        disabled: React.PropTypes.bool
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
            'reactcombobox__arrow_disabled': this.props.disabled,
            'reactcombobox__arrow_up': this.state.isOpened,
            'reactcombobox__arrow_down': !this.state.isOpened
        });

        //support custom drop down item
        var itemBlock = this.props.children || this.props.cutomItem || <DropDownItem/>;

        return (
            <div className="reactcombobox">
                <div className="reactcombobox__input-wrap">
                    <a className={classes} onClick={this.handleArrowClick} tabIndex="-1"></a>

                    <input type="text" className="reactcombobox__input" ref="textInput"
                        value={this.props.value}
                        disabled={this.props.disabled}
                        onFocus={this.openDropDown}
                        onBlur={this.closeDropDown}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeys}/>
                </div>

                <DropDownList items={this.state.filteredOptions ||this.props.options}
                    titleField={this.props.titleField}
                    selected={this.state.selectedItem}
                    show={this.state.isOpened}
                    itemBlock={itemBlock}
                    onSelect={this.selectItem}/>
            </div>
        );
    },
    selectItem: function(item){
        this.setState({selectedItem: item});

        var value = this.props.titleField ? item[this.props.titleField] : item;

        this.setProps({value: value});
        this.onChange(item, value);
    },
    openDropDown: function(){
        this.setState({isOpened: true});
    },
    closeDropDown: function(){
        this.setState({isOpened: false});
    }
});