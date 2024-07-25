package lk.cooperative.cooperativejaela.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Objects;

@Entity
public class Disitem {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "qty")
    private Integer qty;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "disrequests_id", referencedColumnName = "id", nullable = false)
    private Disrequests disrequests;
    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Disitem)) return false;
        Disitem disitem = (Disitem) o;
        return getId() == disitem.getId() && Objects.equals(getQty(), disitem.getQty()) && Objects.equals(getDisrequests(), disitem.getDisrequests()) && Objects.equals(getItem(), disitem.getItem());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getQty(), getDisrequests(), getItem());
    }

    public Disrequests getDisrequests() {
        return disrequests;
    }

    public void setDisrequests(Disrequests disrequests) {
        this.disrequests = disrequests;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }
}
