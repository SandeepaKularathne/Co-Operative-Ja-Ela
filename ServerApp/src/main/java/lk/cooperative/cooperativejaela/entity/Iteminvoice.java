package lk.cooperative.cooperativejaela.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Iteminvoice {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "linetotal")
    private BigDecimal linetotal;
    @Basic
    @Column(name = "qty")
    private Integer qty;
    @ManyToOne
    @JoinColumn(name = "Item_id", referencedColumnName = "id", nullable = false)
    private Item item;
    @ManyToOne
    @JoinColumn(name = "invoice_id", referencedColumnName = "id", nullable = false)
    private Invoice invoice;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getLinetotal() {
        return linetotal;
    }

    public void setLinetotal(BigDecimal linetotal) {
        this.linetotal = linetotal;
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
        if (o == null || getClass() != o.getClass()) return false;
        Iteminvoice that = (Iteminvoice) o;
        return id == that.id && Objects.equals(linetotal, that.linetotal) && Objects.equals(qty, that.qty);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, linetotal, qty);
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }
}
