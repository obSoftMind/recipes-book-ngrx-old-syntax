import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector:'[appDropdown]'
})
export class DropdownDirective {

    @HostBinding('class.open') isOpen=false;
    @HostListener('click') toggleOpen(){
        console.log("Hi! Directive is working")
        this.isOpen = !this.isOpen;
    }
}