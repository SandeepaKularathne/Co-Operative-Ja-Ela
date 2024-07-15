package lk.cooperative.cooperativejaela.entity;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.Collection;

@Entity
public class Category {
    @OneToMany(mappedBy = "category")
    private Collection<Subcategory> subcategories;

    public Collection<Subcategory> getSubcategories() {
        return subcategories;
    }

    public void setSubcategories(Collection<Subcategory> subcategories) {
        this.subcategories = subcategories;
    }
}
